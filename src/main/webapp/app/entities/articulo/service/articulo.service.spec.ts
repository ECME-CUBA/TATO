import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArticulo, Articulo } from '../articulo.model';

import { ArticuloService } from './articulo.service';

describe('Articulo Service', () => {
  let service: ArticuloService;
  let httpMock: HttpTestingController;
  let elemDefault: IArticulo;
  let expectedResult: IArticulo | IArticulo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ArticuloService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombre: 'AAAAAAA',
      marca: 'AAAAAAA',
      precio: 0,
      cantidad: 0,
      costo: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Articulo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Articulo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Articulo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          marca: 'BBBBBB',
          precio: 1,
          cantidad: 1,
          costo: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Articulo', () => {
      const patchObject = Object.assign(
        {
          precio: 1,
          costo: 1,
        },
        new Articulo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Articulo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          marca: 'BBBBBB',
          precio: 1,
          cantidad: 1,
          costo: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Articulo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addArticuloToCollectionIfMissing', () => {
      it('should add a Articulo to an empty array', () => {
        const articulo: IArticulo = { id: 123 };
        expectedResult = service.addArticuloToCollectionIfMissing([], articulo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(articulo);
      });

      it('should not add a Articulo to an array that contains it', () => {
        const articulo: IArticulo = { id: 123 };
        const articuloCollection: IArticulo[] = [
          {
            ...articulo,
          },
          { id: 456 },
        ];
        expectedResult = service.addArticuloToCollectionIfMissing(articuloCollection, articulo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Articulo to an array that doesn't contain it", () => {
        const articulo: IArticulo = { id: 123 };
        const articuloCollection: IArticulo[] = [{ id: 456 }];
        expectedResult = service.addArticuloToCollectionIfMissing(articuloCollection, articulo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(articulo);
      });

      it('should add only unique Articulo to an array', () => {
        const articuloArray: IArticulo[] = [{ id: 123 }, { id: 456 }, { id: 83973 }];
        const articuloCollection: IArticulo[] = [{ id: 123 }];
        expectedResult = service.addArticuloToCollectionIfMissing(articuloCollection, ...articuloArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const articulo: IArticulo = { id: 123 };
        const articulo2: IArticulo = { id: 456 };
        expectedResult = service.addArticuloToCollectionIfMissing([], articulo, articulo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(articulo);
        expect(expectedResult).toContain(articulo2);
      });

      it('should accept null and undefined values', () => {
        const articulo: IArticulo = { id: 123 };
        expectedResult = service.addArticuloToCollectionIfMissing([], null, articulo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(articulo);
      });

      it('should return initial array if no Articulo is added', () => {
        const articuloCollection: IArticulo[] = [{ id: 123 }];
        expectedResult = service.addArticuloToCollectionIfMissing(articuloCollection, undefined, null);
        expect(expectedResult).toEqual(articuloCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
