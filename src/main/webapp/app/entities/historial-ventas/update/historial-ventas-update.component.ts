import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IHistorialVentas, HistorialVentas } from '../historial-ventas.model';
import { HistorialVentasService } from '../service/historial-ventas.service';
import { IArticulo } from 'app/entities/articulo/articulo.model';
import { ArticuloService } from 'app/entities/articulo/service/articulo.service';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';
import { VendedorService } from 'app/entities/vendedor/service/vendedor.service';

@Component({
  selector: 'jhi-historial-ventas-update',
  templateUrl: './historial-ventas-update.component.html',
})
export class HistorialVentasUpdateComponent implements OnInit {
  isSaving = false;

  articulosCollection: IArticulo[] = [];
  corredorsCollection: IVendedor[] = [];

  editForm = this.fb.group({
    id: [],
    fechaVenta: [],
    comisionMensajeria: [],
    cantidad: [],
    articulo: [],
    corredor: [],
  });

  constructor(
    protected historialVentasService: HistorialVentasService,
    protected articuloService: ArticuloService,
    protected vendedorService: VendedorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historialVentas }) => {
      if (historialVentas.id === undefined) {
        const today = dayjs().startOf('day');
        historialVentas.fechaVenta = today;
      }

      this.updateForm(historialVentas);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historialVentas = this.createFromForm();
    if (historialVentas.id !== undefined) {
      this.subscribeToSaveResponse(this.historialVentasService.update(historialVentas));
    } else {
      this.subscribeToSaveResponse(this.historialVentasService.create(historialVentas));
    }
  }

  trackArticuloById(_index: number, item: IArticulo): number {
    return item.id!;
  }

  trackVendedorById(_index: number, item: IVendedor): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistorialVentas>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(historialVentas: IHistorialVentas): void {
    this.editForm.patchValue({
      id: historialVentas.id,
      fechaVenta: historialVentas.fechaVenta ? historialVentas.fechaVenta.format(DATE_TIME_FORMAT) : null,
      comisionMensajeria: historialVentas.comisionMensajeria,
      cantidad: historialVentas.cantidad,
      articulo: historialVentas.articulo,
      corredor: historialVentas.corredor,
    });

    this.articulosCollection = this.articuloService.addArticuloToCollectionIfMissing(this.articulosCollection, historialVentas.articulo);
    this.corredorsCollection = this.vendedorService.addVendedorToCollectionIfMissing(this.corredorsCollection, historialVentas.corredor);
  }

  protected loadRelationshipsOptions(): void {
    this.articuloService
      .query({ filter: 'historialventas-is-null' })
      .pipe(map((res: HttpResponse<IArticulo[]>) => res.body ?? []))
      .pipe(
        map((articulos: IArticulo[]) =>
          this.articuloService.addArticuloToCollectionIfMissing(articulos, this.editForm.get('articulo')!.value)
        )
      )
      .subscribe((articulos: IArticulo[]) => (this.articulosCollection = articulos));

    this.vendedorService
      .query({ filter: 'historialventas-is-null' })
      .pipe(map((res: HttpResponse<IVendedor[]>) => res.body ?? []))
      .pipe(
        map((vendedors: IVendedor[]) =>
          this.vendedorService.addVendedorToCollectionIfMissing(vendedors, this.editForm.get('corredor')!.value)
        )
      )
      .subscribe((vendedors: IVendedor[]) => (this.corredorsCollection = vendedors));
  }

  protected createFromForm(): IHistorialVentas {
    return {
      ...new HistorialVentas(),
      id: this.editForm.get(['id'])!.value,
      fechaVenta: this.editForm.get(['fechaVenta'])!.value ? dayjs(this.editForm.get(['fechaVenta'])!.value, DATE_TIME_FORMAT) : undefined,
      comisionMensajeria: this.editForm.get(['comisionMensajeria'])!.value,
      cantidad: this.editForm.get(['cantidad'])!.value,
      articulo: this.editForm.get(['articulo'])!.value,
      corredor: this.editForm.get(['corredor'])!.value,
    };
  }
}
