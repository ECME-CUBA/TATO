export interface IVendedor {
  id?: number;
  nombre?: string;
}

export class Vendedor implements IVendedor {
  constructor(public id?: number, public nombre?: string) {}
}

export function getVendedorIdentifier(vendedor: IVendedor): number | undefined {
  return vendedor.id;
}
