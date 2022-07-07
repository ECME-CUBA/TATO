import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistorialVentas, HistorialVentas } from '../historial-ventas.model';
import { HistorialVentasService } from '../service/historial-ventas.service';

@Injectable({ providedIn: 'root' })
export class HistorialVentasRoutingResolveService implements Resolve<IHistorialVentas> {
  constructor(protected service: HistorialVentasService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistorialVentas> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((historialVentas: HttpResponse<HistorialVentas>) => {
          if (historialVentas.body) {
            return of(historialVentas.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new HistorialVentas());
  }
}
