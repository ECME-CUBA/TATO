import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HistorialVentasService } from '../service/historial-ventas.service';
import { IHistorialVentas, HistorialVentas } from '../historial-ventas.model';
import { IArticulo } from 'app/entities/articulo/articulo.model';
import { ArticuloService } from 'app/entities/articulo/service/articulo.service';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';
import { VendedorService } from 'app/entities/vendedor/service/vendedor.service';

import { HistorialVentasUpdateComponent } from './historial-ventas-update.component';

describe('HistorialVentas Management Update Component', () => {
  let comp: HistorialVentasUpdateComponent;
  let fixture: ComponentFixture<HistorialVentasUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let historialVentasService: HistorialVentasService;
  let articuloService: ArticuloService;
  let vendedorService: VendedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HistorialVentasUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HistorialVentasUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistorialVentasUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    historialVentasService = TestBed.inject(HistorialVentasService);
    articuloService = TestBed.inject(ArticuloService);
    vendedorService = TestBed.inject(VendedorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call articulo query and add missing value', () => {
      const historialVentas: IHistorialVentas = { id: 456 };
      const articulo: IArticulo = { id: 44106 };
      historialVentas.articulo = articulo;

      const articuloCollection: IArticulo[] = [{ id: 16318 }];
      jest.spyOn(articuloService, 'query').mockReturnValue(of(new HttpResponse({ body: articuloCollection })));
      const expectedCollection: IArticulo[] = [articulo, ...articuloCollection];
      jest.spyOn(articuloService, 'addArticuloToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ historialVentas });
      comp.ngOnInit();

      expect(articuloService.query).toHaveBeenCalled();
      expect(articuloService.addArticuloToCollectionIfMissing).toHaveBeenCalledWith(articuloCollection, articulo);
      expect(comp.articulosCollection).toEqual(expectedCollection);
    });

    it('Should call corredor query and add missing value', () => {
      const historialVentas: IHistorialVentas = { id: 456 };
      const corredor: IVendedor = { id: 18055 };
      historialVentas.corredor = corredor;

      const corredorCollection: IVendedor[] = [{ id: 16592 }];
      jest.spyOn(vendedorService, 'query').mockReturnValue(of(new HttpResponse({ body: corredorCollection })));
      const expectedCollection: IVendedor[] = [corredor, ...corredorCollection];
      jest.spyOn(vendedorService, 'addVendedorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ historialVentas });
      comp.ngOnInit();

      expect(vendedorService.query).toHaveBeenCalled();
      expect(vendedorService.addVendedorToCollectionIfMissing).toHaveBeenCalledWith(corredorCollection, corredor);
      expect(comp.corredorsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const historialVentas: IHistorialVentas = { id: 456 };
      const articulo: IArticulo = { id: 50407 };
      historialVentas.articulo = articulo;
      const corredor: IVendedor = { id: 72571 };
      historialVentas.corredor = corredor;

      activatedRoute.data = of({ historialVentas });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(historialVentas));
      expect(comp.articulosCollection).toContain(articulo);
      expect(comp.corredorsCollection).toContain(corredor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HistorialVentas>>();
      const historialVentas = { id: 123 };
      jest.spyOn(historialVentasService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historialVentas });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historialVentas }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(historialVentasService.update).toHaveBeenCalledWith(historialVentas);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HistorialVentas>>();
      const historialVentas = new HistorialVentas();
      jest.spyOn(historialVentasService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historialVentas });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historialVentas }));
      saveSubject.complete();

      // THEN
      expect(historialVentasService.create).toHaveBeenCalledWith(historialVentas);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HistorialVentas>>();
      const historialVentas = { id: 123 };
      jest.spyOn(historialVentasService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historialVentas });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(historialVentasService.update).toHaveBeenCalledWith(historialVentas);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackArticuloById', () => {
      it('Should return tracked Articulo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackArticuloById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackVendedorById', () => {
      it('Should return tracked Vendedor primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVendedorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
