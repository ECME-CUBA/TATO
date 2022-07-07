import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArticuloComponent } from './list/articulo.component';
import { ArticuloDetailComponent } from './detail/articulo-detail.component';
import { ArticuloUpdateComponent } from './update/articulo-update.component';
import { ArticuloDeleteDialogComponent } from './delete/articulo-delete-dialog.component';
import { ArticuloRoutingModule } from './route/articulo-routing.module';

@NgModule({
  imports: [SharedModule, ArticuloRoutingModule],
  declarations: [ArticuloComponent, ArticuloDetailComponent, ArticuloUpdateComponent, ArticuloDeleteDialogComponent],
  entryComponents: [ArticuloDeleteDialogComponent],
})
export class ArticuloModule {}
