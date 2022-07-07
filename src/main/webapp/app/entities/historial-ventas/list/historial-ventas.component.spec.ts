import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HistorialVentasService } from '../service/historial-ventas.service';

import { HistorialVentasComponent } from './historial-ventas.component';

describe('HistorialVentas Management Component', () => {
  let comp: HistorialVentasComponent;
  let fixture: ComponentFixture<HistorialVentasComponent>;
  let service: HistorialVentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HistorialVentasComponent],
    })
      .overrideTemplate(HistorialVentasComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistorialVentasComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HistorialVentasService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.historialVentas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
