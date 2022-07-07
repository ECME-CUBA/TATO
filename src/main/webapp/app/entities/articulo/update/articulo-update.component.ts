import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IArticulo, Articulo } from '../articulo.model';
import { ArticuloService } from '../service/articulo.service';

@Component({
  selector: 'jhi-articulo-update',
  templateUrl: './articulo-update.component.html',
})
export class ArticuloUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombre: [],
    marca: [],
    precio: [],
    cantidad: [],
    costo: [],
  });

  constructor(protected articuloService: ArticuloService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ articulo }) => {
      this.updateForm(articulo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const articulo = this.createFromForm();
    if (articulo.id !== undefined) {
      this.subscribeToSaveResponse(this.articuloService.update(articulo));
    } else {
      this.subscribeToSaveResponse(this.articuloService.create(articulo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArticulo>>): void {
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

  protected updateForm(articulo: IArticulo): void {
    this.editForm.patchValue({
      id: articulo.id,
      nombre: articulo.nombre,
      marca: articulo.marca,
      precio: articulo.precio,
      cantidad: articulo.cantidad,
      costo: articulo.costo,
    });
  }

  protected createFromForm(): IArticulo {
    return {
      ...new Articulo(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      marca: this.editForm.get(['marca'])!.value,
      precio: this.editForm.get(['precio'])!.value,
      cantidad: this.editForm.get(['cantidad'])!.value,
      costo: this.editForm.get(['costo'])!.value,
    };
  }
}
