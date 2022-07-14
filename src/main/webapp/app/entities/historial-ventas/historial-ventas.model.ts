import dayjs from 'dayjs/esm';
import { IArticulo } from 'app/entities/articulo/articulo.model';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';

export interface IHistorialVentas {
  id?: number;
  fechaVenta?: dayjs.Dayjs | null;
  comisionMensajeria?: number | null;
  cantidad?: number | null;
  articulo?: IArticulo | null;
  corredor?: IVendedor | null;
}

export class HistorialVentas implements IHistorialVentas {
  constructor(
    public id?: number,
    public fechaVenta?: dayjs.Dayjs | null,
    public comisionMensajeria?: number | null,
    public cantidad?: number | null,
    public articulo?: IArticulo | null,
    public corredor?: IVendedor | null
  ) {}
}

export function getHistorialVentasIdentifier(historialVentas: IHistorialVentas): number | undefined {
  return historialVentas.id;
}
