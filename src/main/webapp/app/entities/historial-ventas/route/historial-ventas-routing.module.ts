import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistorialVentasComponent } from '../list/historial-ventas.component';
import { HistorialVentasDetailComponent } from '../detail/historial-ventas-detail.component';
import { HistorialVentasUpdateComponent } from '../update/historial-ventas-update.component';
import { HistorialVentasRoutingResolveService } from './historial-ventas-routing-resolve.service';

const historialVentasRoute: Routes = [
  {
    path: '',
    component: HistorialVentasComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistorialVentasDetailComponent,
    resolve: {
      historialVentas: HistorialVentasRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistorialVentasUpdateComponent,
    resolve: {
      historialVentas: HistorialVentasRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistorialVentasUpdateComponent,
    resolve: {
      historialVentas: HistorialVentasRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(historialVentasRoute)],
  exports: [RouterModule],
})
export class HistorialVentasRoutingModule {}
