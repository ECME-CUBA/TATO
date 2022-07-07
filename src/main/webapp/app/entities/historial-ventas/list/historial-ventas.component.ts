import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistorialVentas } from '../historial-ventas.model';
import { HistorialVentasService } from '../service/historial-ventas.service';
import { HistorialVentasDeleteDialogComponent } from '../delete/historial-ventas-delete-dialog.component';

@Component({
  selector: 'jhi-historial-ventas',
  templateUrl: './historial-ventas.component.html',
})
export class HistorialVentasComponent implements OnInit {
  historialVentas?: IHistorialVentas[];
  isLoading = false;

  constructor(protected historialVentasService: HistorialVentasService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.historialVentasService.query().subscribe({
      next: (res: HttpResponse<IHistorialVentas[]>) => {
        this.isLoading = false;
        this.historialVentas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IHistorialVentas): number {
    return item.id!;
  }

  delete(historialVentas: IHistorialVentas): void {
    const modalRef = this.modalService.open(HistorialVentasDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.historialVentas = historialVentas;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
