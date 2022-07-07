export interface IArticulo {
  id?: number;
  nombre?: string | null;
  marca?: string | null;
  precio?: number | null;
  cantidad?: number | null;
  costo?: number | null;
}

export class Articulo implements IArticulo {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public marca?: string | null,
    public precio?: number | null,
    public cantidad?: number | null,
    public costo?: number | null
  ) {}
}

export function getArticuloIdentifier(articulo: IArticulo): number | undefined {
  return articulo.id;
}
