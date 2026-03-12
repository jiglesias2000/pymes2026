import httpService from "./http.service";
import { config } from "../config";

const urlResourceVentas = config.urlResourceVentas;
const urlResourceVentasDetalles = config.urlResourceVentasDetalles;


async function Consultar(FechaDesde, FechaHasta, IdCliente) {
  const resp = await httpService.get(urlResourceVentas, {
    params: { FechaDesde, FechaHasta, IdCliente: IdCliente || undefined },
  });
  return resp.data;
}


async function BuscarDetalles(IdVenta) {
  const resp = await httpService.get(urlResourceVentasDetalles + "/" + IdVenta);
  return resp.data;
}


async function Grabar(Venta, VentasDetalle) {
  const resp = await httpService.post(urlResourceVentas, { Venta, VentasDetalle });
  return resp.data;
}


export const ventasService = {
  Consultar,
  BuscarDetalles,
  Grabar,
};
