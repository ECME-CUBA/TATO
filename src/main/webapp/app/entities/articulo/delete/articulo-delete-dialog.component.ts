import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArticulo } from '../articulo.model';
import { ArticuloService } from '../service/articulo.service';

@Component({
  templateUrl: './articulo-delete-dialog.component.html',
})
export class ArticuloDeleteDialogComponent {
  articulo?: IArticulo;

  constructor(protected articuloService: ArticuloService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.articuloService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
