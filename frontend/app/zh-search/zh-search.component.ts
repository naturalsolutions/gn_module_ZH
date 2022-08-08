import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HydrographicZone } from "../models/zones";

import { ErrorTranslatorService } from "../services/error-translator.service";

import { ZhDataService } from "../services/zh-data.service";

@Component({
  selector: "zh-search",
  templateUrl: "./zh-search.component.html",
  styleUrls: ["./zh-search.component.scss"],
})
export class ZhSearchComponent implements OnInit {
  @Input() data: any;
  @Output() onClose = new EventEmitter<object>();
  @Output() onSearch = new EventEmitter<object>();
  public advancedSearchToggled: boolean = false;
  public hierarchySearchToggled: boolean = false;
  public basins: [];
  public hydrographicZones: HydrographicZone[];
  public departements: [];
  public communes: [];
  public advancedForm: FormGroup;
  public searchForm: FormGroup;
  public hierarchyForm: FormGroup;

  constructor(
    private _dataService: ZhDataService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _error: ErrorTranslatorService,
    public ngbModal: NgbModal,
  ) {}

  ngOnInit() {
    this._dataService
      .getDepartments()
      .toPromise()
      .then((resp: any) => {
        this.departements = resp;
      })
      .catch((error) => {
        const frontMsg: string = this._error.getFrontError(error.error.message);
        this.displayError(frontMsg);
      });

    this._dataService
      .getBasins()
      .toPromise()
      .then((resp: any) => {
        this.basins = resp;
      })
      .catch((error) => {
        const frontMsg: string = this._error.getFrontError(error.error.message);
        this.displayError(frontMsg);
      });

    this.initForm();
  }

  onDepartmentSelected(event) {
    // Reset form
    this.searchForm.get("communes").reset();
    // reset it for the select to be disabled
    this.communes = undefined;
    if (event && event.length > 0) {
      const department = event[0].code;
      this._dataService
        .getCommuneFromDepartment(department)
        .toPromise()
        .then((resp: any) => (this.communes = resp));
    }
  }

  onBasinSelected(event) {
    // Reset form
    this.searchForm.get("zones").reset();
    // reset it for the select to be disabled
    this.hydrographicZones = undefined;
    if (event && event.length > 0) {
      const basin = event[0].code;
      this._dataService
        .getHydroZoneFromBasin(basin)
        .toPromise()
        .then((resp: any) => (this.hydrographicZones = resp));
    }
  }

  search() {
    if (!this.searchForm.invalid) {
      const searchObj = Object.assign(
        {},
        this.searchForm.value,
        this.advancedForm.value,
        this.hierarchyForm.value
      );
      const filtered = this.filterFormGroup(searchObj);
      this.onSearch.emit(filtered);
    }
  }

  onReset() {
    this.searchForm.reset();
    this.advancedForm.reset();
    // reset does not work with FormArray...
    this.initHierarchyForm();
    // Emit empty object to search all ZH
    this.onSearch.emit(new Object());
  }

  initForm() {
    this.searchForm = this._fb.group({
      basin: [null],
      departement: [null],
      communes: [null],
      sdage: [null],
      nameorcode: [null],
      zones: [null],
      ensemble: [null],
      area: this._fb.group({
        ha: [
          null,
          {
            validators: [Validators.min(0)],
          },
        ],
        symbol: [null],
      }),
    });
    this.advancedForm = this._fb.group({
      hydro: this._fb.group({
        functions: [null],
        qualifications: [null],
        connaissances: [null],
      }),
      bio: this._fb.group({
        functions: [null],
        qualifications: [null],
        connaissances: [null],
      }),
      socio: this._fb.group({
        functions: [null],
        qualifications: [null],
        connaissances: [null],
      }),
      interet: this._fb.group({
        functions: [null],
        qualifications: [null],
        connaissances: [null],
      }),
      statuts: this._fb.group({
        statuts: [null],
        plans: [null],
        strategies: [null],
      }),
      evaluations: this._fb.group({
        hydros: [null],
        bios: [null],
        menaces: [null],
      }),
    });
    this.initHierarchyForm();
  }

  initHierarchyForm() {
    this.hierarchyForm = this._fb.group({
      hierarchy: this._fb.group({
        hierarchy: this._fb.array([]),
        and: [false], // if !"and" => OR
      }),
    });
  }

  filterFormGroup(values) {
    const filtered = {};
    // Since everything is a form group:
    Object.keys(values).forEach((key) => {
      let value = values[key];
      if (value !== null && value !== []) {
        if (value instanceof Array) {
          if (value.length !== 0) {
            value = value.filter((item) => item !== null);
            filtered[key] = value;
          }
        } else if (value instanceof Object) {
          value = this.filterFormGroup(value);
          if (Object.keys(value).length !== 0) {
            filtered[key] = value;
          }
        } else {
          filtered[key] = value;
        }
      }
    });

    return filtered;
  }

  onCloseClicked() {
    this.onClose.emit();
  }

  displayError(error: string) {
    this._toastr.error(error);
  }

  openModalHelp(event, modal) {
    this.ngbModal.open(modal);
  }

  onAdvancedSearchToggled() {
    this.advancedSearchToggled = !this.advancedSearchToggled
    if (this.hierarchySearchToggled) {
      this.hierarchySearchToggled = false
      this.initHierarchyForm();
    }
  }
  onHierarchySearchToggled() {
    this.hierarchySearchToggled = !this.hierarchySearchToggled
    if (this.advancedSearchToggled) {
      this.advancedSearchToggled = false
      this.advancedForm.reset()
    }

  }

}
