import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArticulo, getArticuloIdentifier } from '../articulo.model';

export type EntityResponseType = HttpResponse<IArticulo>;
export type EntityArrayResponseType = HttpResponse<IArticulo[]>;

@Injectable({ providedIn: 'root' })
export class ArticuloService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/articulos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(articulo: IArticulo): Observable<EntityResponseType> {
    return this.http.post<IArticulo>(this.resourceUrl, articulo, { observe: 'response' });
  }

  update(articulo: IArticulo): Observable<EntityResponseType> {
    return this.http.put<IArticulo>(`${this.resourceUrl}/${getArticuloIdentifier(articulo) as number}`, articulo, { observe: 'response' });
  }

  partialUpdate(articulo: IArticulo): Observable<EntityResponseType> {
    return this.http.patch<IArticulo>(`${this.resourceUrl}/${getArticuloIdentifier(articulo) as number}`, articulo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArticulo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArticulo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArticuloToCollectionIfMissing(articuloCollection: IArticulo[], ...articulosToCheck: (IArticulo | null | undefined)[]): IArticulo[] {
    const articulos: IArticulo[] = articulosToCheck.filter(isPresent);
    if (articulos.length > 0) {
      const articuloCollectionIdentifiers = articuloCollection.map(articuloItem => getArticuloIdentifier(articuloItem)!);
      const articulosToAdd = articulos.filter(articuloItem => {
        const articuloIdentifier = getArticuloIdentifier(articuloItem);
        if (articuloIdentifier == null || articuloCollectionIdentifiers.includes(articuloIdentifier)) {
          return false;
        }
        articuloCollectionIdentifiers.push(articuloIdentifier);
        return true;
      });
      return [...articulosToAdd, ...articuloCollection];
    }
    return articuloCollection;
  }
}
