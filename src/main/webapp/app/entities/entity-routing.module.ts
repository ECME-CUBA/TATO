import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'vendedor',
        data: { pageTitle: 'Vendedors' },
        loadChildren: () => import('./vendedor/vendedor.module').then(m => m.VendedorModule),
      },
      {
        path: 'articulo',
        data: { pageTitle: 'Articulos' },
        loadChildren: () => import('./articulo/articulo.module').then(m => m.ArticuloModule),
      },
      {
        path: 'historial-ventas',
        data: { pageTitle: 'HistorialVentas' },
        loadChildren: () => import('./historial-ventas/historial-ventas.module').then(m => m.HistorialVentasModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
