import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistorialVentas, getHistorialVentasIdentifier } from '../historial-ventas.model';

export type EntityResponseType = HttpResponse<IHistorialVentas>;
export type EntityArrayResponseType = HttpResponse<IHistorialVentas[]>;

@Injectable({ providedIn: 'root' })
export class HistorialVentasService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/historial-ventas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(historialVentas: IHistorialVentas): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historialVentas);
    return this.http
      .post<IHistorialVentas>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(historialVentas: IHistorialVentas): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historialVentas);
    return this.http
      .put<IHistorialVentas>(`${this.resourceUrl}/${getHistorialVentasIdentifier(historialVentas) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(historialVentas: IHistorialVentas): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historialVentas);
    return this.http
      .patch<IHistorialVentas>(`${this.resourceUrl}/${getHistorialVentasIdentifier(historialVentas) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHistorialVentas>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistorialVentas[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHistorialVentasToCollectionIfMissing(
    historialVentasCollection: IHistorialVentas[],
    ...historialVentasToCheck: (IHistorialVentas | null | undefined)[]
  ): IHistorialVentas[] {
    const historialVentas: IHistorialVentas[] = historialVentasToCheck.filter(isPresent);
    if (historialVentas.length > 0) {
      const historialVentasCollectionIdentifiers = historialVentasCollection.map(
        historialVentasItem => getHistorialVentasIdentifier(historialVentasItem)!
      );
      const historialVentasToAdd = historialVentas.filter(historialVentasItem => {
        const historialVentasIdentifier = getHistorialVentasIdentifier(historialVentasItem);
        if (historialVentasIdentifier == null || historialVentasCollectionIdentifiers.includes(historialVentasIdentifier)) {
          return false;
        }
        historialVentasCollectionIdentifiers.push(historialVentasIdentifier);
        return true;
      });
      return [...historialVentasToAdd, ...historialVentasCollection];
    }
    return historialVentasCollection;
  }

  protected convertDateFromClient(historialVentas: IHistorialVentas): IHistorialVentas {
    return Object.assign({}, historialVentas, {
      fechaVenta: historialVentas.fechaVenta?.isValid() ? historialVentas.fechaVenta.toJSON() : undefined,
      endDate: historialVentas.endDate?.isValid() ? historialVentas.endDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaVenta = res.body.fechaVenta ? dayjs(res.body.fechaVenta) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((historialVentas: IHistorialVentas) => {
        historialVentas.fechaVenta = historialVentas.fechaVenta ? dayjs(historialVentas.fechaVenta) : undefined;
        historialVentas.endDate = historialVentas.endDate ? dayjs(historialVentas.endDate) : undefined;
      });
    }
    return res;
  }
}
