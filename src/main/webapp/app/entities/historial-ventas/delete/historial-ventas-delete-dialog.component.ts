import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistorialVentas } from '../historial-ventas.model';
import { HistorialVentasService } from '../service/historial-ventas.service';

@Component({
  templateUrl: './historial-ventas-delete-dialog.component.html',
})
export class HistorialVentasDeleteDialogComponent {
  historialVentas?: IHistorialVentas;

  constructor(protected historialVentasService: HistorialVentasService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historialVentasService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
