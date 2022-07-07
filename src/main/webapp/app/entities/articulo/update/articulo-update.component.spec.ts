import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ArticuloService } from '../service/articulo.service';
import { IArticulo, Articulo } from '../articulo.model';

import { ArticuloUpdateComponent } from './articulo-update.component';

describe('Articulo Management Update Component', () => {
  let comp: ArticuloUpdateComponent;
  let fixture: ComponentFixture<ArticuloUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let articuloService: ArticuloService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ArticuloUpdateComponent],
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
      .overrideTemplate(ArticuloUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ArticuloUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    articuloService = TestBed.inject(ArticuloService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const articulo: IArticulo = { id: 456 };

      activatedRoute.data = of({ articulo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(articulo));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Articulo>>();
      const articulo = { id: 123 };
      jest.spyOn(articuloService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ articulo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: articulo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(articuloService.update).toHaveBeenCalledWith(articulo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Articulo>>();
      const articulo = new Articulo();
      jest.spyOn(articuloService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ articulo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: articulo }));
      saveSubject.complete();

      // THEN
      expect(articuloService.create).toHaveBeenCalledWith(articulo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Articulo>>();
      const articulo = { id: 123 };
      jest.spyOn(articuloService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ articulo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(articuloService.update).toHaveBeenCalledWith(articulo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
