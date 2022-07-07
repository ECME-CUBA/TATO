import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistorialVentas } from '../historial-ventas.model';

@Component({
  selector: 'jhi-historial-ventas-detail',
  templateUrl: './historial-ventas-detail.component.html',
})
export class HistorialVentasDetailComponent implements OnInit {
  historialVentas: IHistorialVentas | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historialVentas }) => {
      this.historialVentas = historialVentas;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
