import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArticuloComponent } from '../list/articulo.component';
import { ArticuloDetailComponent } from '../detail/articulo-detail.component';
import { ArticuloUpdateComponent } from '../update/articulo-update.component';
import { ArticuloRoutingResolveService } from './articulo-routing-resolve.service';

const articuloRoute: Routes = [
  {
    path: '',
    component: ArticuloComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArticuloDetailComponent,
    resolve: {
      articulo: ArticuloRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArticuloUpdateComponent,
    resolve: {
      articulo: ArticuloRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArticuloUpdateComponent,
    resolve: {
      articulo: ArticuloRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(articuloRoute)],
  exports: [RouterModule],
})
export class ArticuloRoutingModule {}
