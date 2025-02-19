import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { GeoJSON } from 'leaflet';
import * as L from 'leaflet';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MapService } from '@geonature_common/map/map.service';
import { ToastrService } from 'ngx-toastr';
import { ZhDataService } from '../../../services/zh-data.service';
import { TabsService } from '../../../services/tabs.service';
import { ErrorTranslatorService } from '../../../services/error-translator.service';
import { PbfService } from '../../../services/pbf.service';
import { HierarchyService } from '../../../services/hierarchy.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerI18n, I18n } from '../../../services/datepicker-i18n.service';
import { NgbDateFRParserFormatter } from '../../../services/dateFrFormatter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';

const GEOM_CONTAINED_ID = 1;

@Component({
  selector: 'zh-form-tab0',
  templateUrl: './zh-form-tab0.component.html',
  styleUrls: ['./zh-form-tab0.component.scss'],
  providers: [
    I18n,
    { provide: NgbDatepickerI18n, useClass: DatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ],
})
export class ZhFormTab0Component implements OnInit {
  @Input() formMetaData;
  @Output() activeTabs = new EventEmitter<boolean>();
  @Output() canChangeTab = new EventEmitter<boolean>();
  @Output() nextTab = new EventEmitter<number>();
  public _currentZh: any = null;
  public form: FormGroup;
  public cardContentHeight: number;
  public critDelim: any;
  public sdage: any;
  public field_creation_date: any;
  public observer: any;
  public idOrg: any;
  public $_geojsonSub: Subscription;
  public $_currentZhSub: Subscription;
  private geometry: any;
  private currentLayer: any;
  public submitted = false;
  public posted = false;
  private geomLayers: any;
  public zhId: number;
  public toggleChecked: boolean = false; // TODO: PUT INTO PARAMETER ?
  corinTableCol = [
    { name: 'corinBio', label: 'Code Corine biotopes', subcell: { name: 'CB_code' } },
    { name: 'corinBio', label: 'Libellé Corine biotopes', subcell: { name: 'CB_label' } },
    { name: 'corinBio', label: 'Humidité', size: '5%', subcell: { name: 'CB_humidity' } },
    { name: 'cbCover', label: 'Recouvrement sur la ZH (%)', size: '5%' },
  ];
  corinBioMetaData: any;
  listCorinBio: any = [];
  patchCorinBio: boolean = false;
  corinBioForm: FormGroup;
  cb_to_patch: any;
  formCorinSubmitted: boolean;
  modalButtonLabel: string;
  modalTitle: string;
  addModalBtnLabel: string;
  patchActivity: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _dataService: ZhDataService,
    private _tabService: TabsService,
    private _mapService: MapService,
    private _router: Router,
    private _toastr: ToastrService,
    private _error: ErrorTranslatorService,
    private _pbfService: PbfService,
    public hierarchy: HierarchyService,
    private dateParser: NgbDateParserFormatter,
    public ngbModal: NgbModal,
    private _modalService: ModalService
  ) {}

  ngOnInit() {
    this.getMetaData();
    this.createForm();

    // do not delete it
    this.$_geojsonSub = this._mapService.gettingGeojson$.subscribe(() => {});

    this.intiTab(); // FIXME Find a way to remove this
    this._tabService.getTabChange().subscribe((tabPosition: number) => {
      if (tabPosition == 0) {
        this.intiTab();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.calcCardContentHeight(), 0);
    this.geomLayers = [];
    this.removeLayers();
    // Here so that the mapService is already initialized
    this._pbfService
      .getPbf(this._mapService.map)
      .toPromise()
      .then((data) => {
        // Do not show the data on the map by default
        if (data) {
          data = data.setOpacity(0);
          this.geomLayers.push(data.addTo(this._mapService.map));
        }
      });
    this._pbfService.setPaneBackground(this._mapService.map);
  }

  intiTab() {
    this.$_currentZhSub = this._dataService.currentZh.subscribe((zh: any) => {
      if (zh) {
        this._currentZh = zh;
        this.zhId = this._currentZh.properties.id_zh;
        this._mapService.removeAllLayers(
          this._mapService.map,
          this._mapService.leafletDrawFeatureGroup
        );
        const selectedCritDelim = [];
        this.critDelim.forEach((critere) => {
          if (this._currentZh.properties.id_lims.includes(critere.id_nomenclature)) {
            selectedCritDelim.push(critere);
          }
        });
        const field_creation_date = new Date(
          this._currentZh.properties.field_creation_date.split(' ')[0]
        ).toLocaleDateString('fr-FR');
        this.form.patchValue({
          id_org: this._currentZh.properties.id_org,
          main_name: this._currentZh.properties.main_name,
          critere_delim: selectedCritDelim,
          sdage: this._currentZh.properties.id_sdage,
          field_creation_date: this.dateParser.parse(field_creation_date),
          observer: this._currentZh.properties.observer,
        });
        this.listCorinBio = [];
        if (
          this._currentZh.properties.cb_codes_corine_biotope &&
          this._currentZh.properties.cb_codes_corine_biotope.length > 0
        ) {
          this._currentZh.properties.cb_codes_corine_biotope.forEach((cb) => {
            this.corinBioMetaData.find((item) => {
              if (item.CB_code == cb.lb_code) {
                this.listCorinBio.push({ corinBio: item, cbCover: cb.cb_cover });
              }
            });
          });
        }

        // Must put a set timeout here otherwise
        // this._mapService is undefined...
        setTimeout(() => {
          // Transform into a featureCollection to feed the
          // leafletDrawFeatureGroup
          this.geometry = this.multipolygonToFeatureCollection(this._currentZh.geometry);
          // Clears the layers before adding the geometry to
          // prevent having the same superimposed layers...
          this._mapService.leafletDrawFeatureGroup.clearLayers();
          const layer = L.geoJSON(this.geometry as any, {
            onEachFeature: (feature, layer) => {
              this._mapService.leafletDrawFeatureGroup.addLayer(layer);
            },
          });
          this._mapService.map.fitBounds(layer.getBounds());
          //this._mapService.leafletDrawFeatureGroup.addTo(this._mapService.map);
          this.currentLayer = layer;
        }, 0);
        this.canChangeTab.emit(true);
      }
    });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.corinBioMetaData
              .filter(
                (v) =>
                  v.CB_label.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                  v.CB_code.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      ),
      // Not to display a Corine that is already in the table
      map((term) =>
        term.filter((t) => !this.listCorinBio.map((c) => c.corinBio.CB_code).includes(t.CB_code))
      )
    );

  formatter = (result: any) => `${result.CB_code} ${result.CB_label}`;

  // open the add CorinBio modal
  onAddCorinBio(event: any, modal: any) {
    this.canChangeTab.emit(false);
    this.patchCorinBio = false;
    this.addModalBtnLabel = 'Ajouter';

    this.modalTitle = "Ajout d'un habitat Corine Biotopes";
    event.stopPropagation();
    this.ngbModal.open(modal, {
      centered: true,
      size: 'lg',
      windowClass: 'bib-modal',
    });
    this.corinBioForm.reset();
  }

  onDeleteCorin(CB_code: string) {
    this.listCorinBio = this.listCorinBio.filter((item) => {
      return item.corinBio.CB_code != CB_code;
    });
    this.canChangeTab.emit(false);
  }

  // add a new CorineBio to CorineBio array
  onPostCorinBio() {
    this.patchCorinBio = false;
    this.formCorinSubmitted = true;
    if (this.corinBioForm.valid) {
      this.listCorinBio.push({
        corinBio: this.corinBioForm.value.corinBio,
        cbCover: this.corinBioForm.value.cbCover,
      });
      this.ngbModal.dismissAll();
      this.corinBioForm.reset();
      this.canChangeTab.emit(false);
      this.formCorinSubmitted = false;
    }
  }

  // open the edit corineBio modal
  onEditCorinBio(modal: any, corinBio: any) {
    this.patchCorinBio = true;
    this.addModalBtnLabel = 'Modifier';
    this.modalTitle = 'Modifier un habitat Corine Biotopes';
    this.cb_to_patch = corinBio;
    this.corinBioForm.patchValue({
      corinBio: corinBio.corinBio,
      cbCover: corinBio.cbCover,
    });
    this._modalService.open(
      modal,
      this.listCorinBio.map((item) => item.corinBio),
      this.corinBioMetaData,
      corinBio
    );
  }

  onPatchCorinBio() {
    console.log('test');
    this.patchActivity = false;
    this.formCorinSubmitted = true;
    if (this.corinBioForm.valid) {
      let cb = this.corinBioForm.value;
      this.listCorinBio = this.listCorinBio.map((item) =>
        item.corinBio != this.cb_to_patch.corinBio ? item : cb
      );
      this.ngbModal.dismissAll();
      this.corinBioForm.reset();
      this.canChangeTab.emit(false);
      this.formCorinSubmitted = false;
      this.cb_to_patch = {};
    }
  }

  calcCardContentHeight() {
    let wH = window.innerHeight;
    let tbH = document.getElementById('app-toolbar')
      ? document.getElementById('app-toolbar').offsetHeight
      : 0;
    let height = wH - (tbH + 81);
    this.cardContentHeight = height >= 350 ? height : 350;
    // resize map after resize container
    if (this._mapService.map) {
      setTimeout(() => {
        this._mapService.map.invalidateSize();
      }, 10);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calcCardContentHeight();
  }

  createForm(): void {
    this.form = this.fb.group({
      id_org: [null, Validators.required],
      main_name: [null, Validators.required],
      critere_delim: [null, Validators.required],
      sdage: ['', Validators.required],
      field_creation_date: [null, Validators.required],
      observer: ['', Validators.required],
    });
    this.corinBioForm = this.fb.group({
      corinBio: [null, Validators.required],
      cbCover: [null, Validators.compose([Validators.min(0), Validators.max(100)])],
    });
    this.form.valueChanges.subscribe(() => {
      this.canChangeTab.emit(false);
    });
  }

  onFormSubmit(formValues: any) {
    this.submitted = true;
    let formToPost = {
      id_org: formValues.id_org,
      main_name: formValues.main_name,
      critere_delim: [],
      sdage: formValues.sdage,
      field_creation_date: formValues.field_creation_date,
      observer: formValues.observer,
      corine_biotopes: this.listCorinBio,
      geom: null,
    };
    // Get the geometry as a featureCollection from the
    // featureGroup layer
    this.geometry = this.featureCollectionToMultipolygon(
      this._mapService.leafletDrawFeatureGroup.toGeoJSON()
    );
    if (this.geometry) {
      formToPost.geom = this.geometry;
      if (this.form.valid && this.listCorinBio.length > 0) {
        formValues.critere_delim.forEach((critere) => {
          formToPost.critere_delim.push(critere.id_nomenclature);
        });
        this.posted = true;
        if (this._currentZh) {
          formToPost['id_zh'] = Number(this._currentZh.properties.id_zh);
        }
        this._dataService.postDataForm(formToPost, 0).subscribe(
          (data) => {
            setTimeout(() => {
              this._mapService.removeAllLayers(
                this._mapService.map,
                this._mapService.leafletDrawFeatureGroup
              );
            }, 0);
            this.posted = false;
            this._dataService.getZhById(data.id_zh).subscribe((zh: any) => {
              this._dataService.setCurrentZh(zh);
              this.activeTabs.emit(true);
              this.canChangeTab.emit(true);
              var msg: string = 'Vos données sont bien enregistrées';
              var timeOut: number = 5000;
              if (data.is_intersected) {
                timeOut = 10000; // stay a little bit longer
                msg +=
                  '<br>La géométrie a été découpée car elle intersectait une autre zone humide';
              }
              this._toastr.success(msg, '', {
                enableHtml: true,
                timeOut: timeOut, // to be sure the user sees
                closeButton: true,
                positionClass: 'toast-top-right',
              });
              this.hierarchy.getHierarchyFromZh(this._currentZh);
              this.nextTab.emit(1);
            });
          },
          (error) => {
            this.posted = false;
            // Not really good, but must filter error id to remove the
            // geometry or not
            if (this._error.getErrorId(error.error.message) == GEOM_CONTAINED_ID) {
              this._mapService.removeAllLayers(
                this._mapService.map,
                this._mapService.leafletDrawFeatureGroup
              );
            }
          }
        );
      }
    } else {
      this._toastr.error('Veuillez tracer une zone humide sur la carte', '', {
        positionClass: 'toast-top-right',
      });
    }
  }

  slideToggleChanged() {
    this.geomLayers.forEach((layer: any) => {
      layer.setOpacity(this.toggleChecked ? 1 : 0);
    });
  }

  onNewGeom(event: any) {
    // Get the geometry from the featureGroup directly
    // Here we will have a featureCollection
    this.geometry = this._mapService.leafletDrawFeatureGroup.toGeoJSON();

    this.canChangeTab.emit(false);
    this._mapService.map.eachLayer((layer: any) => {
      if (this.currentLayer && layer._leaflet_id == this.currentLayer._leaflet_id) {
        this._mapService.map.removeLayer(layer);
      }
    });
  }

  updateGeom(newGeometry: any) {
    this.canChangeTab.emit(false);
    this.geometry = newGeometry;
  }

  onCancel() {
    this.form.reset();
    this._router.navigate(['zones_humides']);
  }

  removeLayers() {
    this.geomLayers = [];
    if (this._mapService.map) {
      this._mapService.map.eachLayer((layer: any) => {
        if (layer.geomTag && layer.geomTag === 'allGeom') {
          this._mapService.map.removeLayer(layer);
        }
      });
    }
  }

  getMetaData() {
    this.idOrg = this.formMetaData['BIB_ORGANISMES'];
    this.corinBioMetaData = [...this.formMetaData['CORINE_BIO']];
    this.critDelim = this.formMetaData['CRIT_DELIM'];
    this.sdage = this.formMetaData['SDAGE'];
  }

  ngOnDestroy() {
    if (this.$_geojsonSub) this.$_geojsonSub.unsubscribe();
    if (this.$_currentZhSub) this.$_currentZhSub.unsubscribe();
    this.hierarchy.clear();
  }

  featureCollectionToMultipolygon(featureCollection) {
    // Transforms a featureCollection from leafletDrawFeatureGroup
    // to a single multipolygon because PostGis cannot interpret a
    // featureGroup
    const features = featureCollection.features;
    let coordinates = [];
    features.forEach((element) => coordinates.push(element.geometry.coordinates));
    return {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: coordinates,
      },
      properties: null,
    };
  }

  getPolygonFeature(coordinates) {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: coordinates,
      },
    };
  }

  multipolygonToFeatureCollection(geometry) {
    // transforms a multipolygon to a feature collection
    // to be able to send it to leafletDrawFeatureGroup
    // to be able to edit each feature
    let features = [];
    // We can have a multipolygon and a polygon here.
    // It can be checked with their coordinates
    if (geometry.coordinates.length > 1 && geometry.type !== 'Polygon') {
      geometry.coordinates.forEach((coord) => features.push(this.getPolygonFeature(coord)));
    } else if (geometry.coordinates.length === 1 && geometry.type !== 'Polygon') {
      features.push(this.getPolygonFeature(geometry.coordinates[0]));
    } else {
      features.push(this.getPolygonFeature(geometry.coordinates));
    }
    return {
      type: 'FeatureCollection',
      features: features,
    };
  }
}
