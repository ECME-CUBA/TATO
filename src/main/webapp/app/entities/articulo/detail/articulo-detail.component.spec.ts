import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArticuloDetailComponent } from './articulo-detail.component';

describe('Articulo Management Detail Component', () => {
  let comp: ArticuloDetailComponent;
  let fixture: ComponentFixture<ArticuloDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticuloDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ articulo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ArticuloDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ArticuloDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load articulo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.articulo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
