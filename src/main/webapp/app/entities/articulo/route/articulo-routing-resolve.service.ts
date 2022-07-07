import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArticulo, Articulo } from '../articulo.model';
import { ArticuloService } from '../service/articulo.service';

@Injectable({ providedIn: 'root' })
export class ArticuloRoutingResolveService implements Resolve<IArticulo> {
  constructor(protected service: ArticuloService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArticulo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((articulo: HttpResponse<Articulo>) => {
          if (articulo.body) {
            return of(articulo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Articulo());
  }
}
