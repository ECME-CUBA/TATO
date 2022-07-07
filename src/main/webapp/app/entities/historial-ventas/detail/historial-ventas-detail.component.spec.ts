import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistorialVentasDetailComponent } from './historial-ventas-detail.component';

describe('HistorialVentas Management Detail Component', () => {
  let comp: HistorialVentasDetailComponent;
  let fixture: ComponentFixture<HistorialVentasDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialVentasDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ historialVentas: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HistorialVentasDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HistorialVentasDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load historialVentas on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.historialVentas).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
