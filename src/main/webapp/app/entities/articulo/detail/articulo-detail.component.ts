import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArticulo } from '../articulo.model';

@Component({
  selector: 'jhi-articulo-detail',
  templateUrl: './articulo-detail.component.html',
})
export class ArticuloDetailComponent implements OnInit {
  articulo: IArticulo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ articulo }) => {
      this.articulo = articulo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
