import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IHistorialVentas, HistorialVentas } from '../historial-ventas.model';
import { HistorialVentasService } from '../service/historial-ventas.service';

import { HistorialVentasRoutingResolveService } from './historial-ventas-routing-resolve.service';

describe('HistorialVentas routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HistorialVentasRoutingResolveService;
  let service: HistorialVentasService;
  let resultHistorialVentas: IHistorialVentas | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(HistorialVentasRoutingResolveService);
    service = TestBed.inject(HistorialVentasService);
    resultHistorialVentas = undefined;
  });

  describe('resolve', () => {
    it('should return IHistorialVentas returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHistorialVentas = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHistorialVentas).toEqual({ id: 123 });
    });

    it('should return new IHistorialVentas if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHistorialVentas = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultHistorialVentas).toEqual(new HistorialVentas());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as HistorialVentas })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHistorialVentas = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHistorialVentas).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
