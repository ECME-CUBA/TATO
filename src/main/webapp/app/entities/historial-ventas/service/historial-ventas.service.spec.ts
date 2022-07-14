import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHistorialVentas, HistorialVentas } from '../historial-ventas.model';

import { HistorialVentasService } from './historial-ventas.service';

describe('HistorialVentas Service', () => {
  let service: HistorialVentasService;
  let httpMock: HttpTestingController;
  let elemDefault: IHistorialVentas;
  let expectedResult: IHistorialVentas | IHistorialVentas[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HistorialVentasService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fechaVenta: currentDate,
      comisionMensajeria: 0,
      cantidad: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fechaVenta: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a HistorialVentas', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fechaVenta: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaVenta: currentDate,
        },
        returnedFromService
      );

      service.create(new HistorialVentas()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HistorialVentas', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fechaVenta: currentDate.format(DATE_TIME_FORMAT),
          comisionMensajeria: 1,
          cantidad: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaVenta: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HistorialVentas', () => {
      const patchObject = Object.assign(
        {
          fechaVenta: currentDate.format(DATE_TIME_FORMAT),
          cantidad: 1,
        },
        new HistorialVentas()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fechaVenta: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HistorialVentas', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fechaVenta: currentDate.format(DATE_TIME_FORMAT),
          comisionMensajeria: 1,
          cantidad: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaVenta: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a HistorialVentas', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHistorialVentasToCollectionIfMissing', () => {
      it('should add a HistorialVentas to an empty array', () => {
        const historialVentas: IHistorialVentas = { id: 123 };
        expectedResult = service.addHistorialVentasToCollectionIfMissing([], historialVentas);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(historialVentas);
      });

      it('should not add a HistorialVentas to an array that contains it', () => {
        const historialVentas: IHistorialVentas = { id: 123 };
        const historialVentasCollection: IHistorialVentas[] = [
          {
            ...historialVentas,
          },
          { id: 456 },
        ];
        expectedResult = service.addHistorialVentasToCollectionIfMissing(historialVentasCollection, historialVentas);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HistorialVentas to an array that doesn't contain it", () => {
        const historialVentas: IHistorialVentas = { id: 123 };
        const historialVentasCollection: IHistorialVentas[] = [{ id: 456 }];
        expectedResult = service.addHistorialVentasToCollectionIfMissing(historialVentasCollection, historialVentas);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(historialVentas);
      });

      it('should add only unique HistorialVentas to an array', () => {
        const historialVentasArray: IHistorialVentas[] = [{ id: 123 }, { id: 456 }, { id: 12825 }];
        const historialVentasCollection: IHistorialVentas[] = [{ id: 123 }];
        expectedResult = service.addHistorialVentasToCollectionIfMissing(historialVentasCollection, ...historialVentasArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const historialVentas: IHistorialVentas = { id: 123 };
        const historialVentas2: IHistorialVentas = { id: 456 };
        expectedResult = service.addHistorialVentasToCollectionIfMissing([], historialVentas, historialVentas2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(historialVentas);
        expect(expectedResult).toContain(historialVentas2);
      });

      it('should accept null and undefined values', () => {
        const historialVentas: IHistorialVentas = { id: 123 };
        expectedResult = service.addHistorialVentasToCollectionIfMissing([], null, historialVentas, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(historialVentas);
      });

      it('should return initial array if no HistorialVentas is added', () => {
        const historialVentasCollection: IHistorialVentas[] = [{ id: 123 }];
        expectedResult = service.addHistorialVentasToCollectionIfMissing(historialVentasCollection, undefined, null);
        expect(expectedResult).toEqual(historialVentasCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
