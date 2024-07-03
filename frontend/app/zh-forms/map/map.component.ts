import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { leafletDrawOption } from '@geonature_common/map/leaflet-draw.options';
import { MapService } from '@geonature_common/map/map.service';

import * as L from 'leaflet';

@Component({
  selector: 'zh-form-map',
  templateUrl: 'map.component.html',
})
export class ZhFormMapComponent implements OnInit, AfterViewInit {
  public leafletDrawOptions: any;
  public geometry: any = null;
  public editedGeometry: any = null;
  @Output() draw = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() endDraw = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor(private _mapService: MapService) {}

  ngOnInit() {
    // overight the leaflet draw object to set options
    // examples: enable circle =>  leafletDrawOption.draw.circle = true;
    leafletDrawOption.draw.marker = false;
    leafletDrawOption.draw.polyline = false;
    leafletDrawOption.edit.remove = true;
    this.leafletDrawOptions = leafletDrawOption;
    // set the input for the marker component
    // set the coord only when load data and when its edition mode (id_releve)
    // after the marker component does it by itself whith the ouput
    // when modifie the coordinates innput, it create twice the marker
  }

  ngAfterViewInit() {
    if (this._mapService.currentExtend) {
      this._mapService.map.setView(
        this._mapService.currentExtend.center,
        this._mapService.currentExtend.zoom
      );
    }
    this._mapService.map.off(L.Draw.Event.DRAWSTART);
    this._mapService.map.on(L.Draw.Event.CREATED, (e) => {
      this.onDrawStop(e);
    });
    this._mapService.map.off(L.Draw.Event.EDITED);
    this._mapService.map.on(L.Draw.Event.EDITSTART, (e) => {
      this.onBeginEdit(e);
    });
    this._mapService.map.on(L.Draw.Event.EDITED, (e) => {
      this.onEdit(e);
    });
    this._mapService.map.on(L.Draw.Event.DELETED, (e) => {
      this.onEdit(e);
    });
  }

  onDrawn(e) {
    this.draw.emit(e);
  }

  onBeginEdit(e) {
    this.editedGeometry = e;
  }

  onEdit(e) {
    e.layers.eachLayer((e) => this.edit.emit(e.toGeoJSON()));
  }

  onDrawStop(e) {
    this.endDraw.emit(e);
  }

  onDeleted(e) {
    this.delete.emit(e);
  }
}
