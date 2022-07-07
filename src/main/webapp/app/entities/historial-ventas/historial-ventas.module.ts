import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HistorialVentasComponent } from './list/historial-ventas.component';
import { HistorialVentasDetailComponent } from './detail/historial-ventas-detail.component';
import { HistorialVentasUpdateComponent } from './update/historial-ventas-update.component';
import { HistorialVentasDeleteDialogComponent } from './delete/historial-ventas-delete-dialog.component';
import { HistorialVentasRoutingModule } from './route/historial-ventas-routing.module';

@NgModule({
  imports: [SharedModule, HistorialVentasRoutingModule],
  declarations: [
    HistorialVentasComponent,
    HistorialVentasDetailComponent,
    HistorialVentasUpdateComponent,
    HistorialVentasDeleteDialogComponent,
  ],
  entryComponents: [HistorialVentasDeleteDialogComponent],
})
export class HistorialVentasModule {}
