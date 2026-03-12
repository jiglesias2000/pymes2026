import httpService from "./http.service";
import { config } from "../config";

const urlResource = config.urlResourceClientes;


async function Buscar(Nombre, Activo, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp.data;
}


async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdCliente);
  return resp.data;
}


async function ActivarDesactivar(item) {
  await httpService.delete(urlResource + "/" + item.IdCliente);
}


async function Grabar(item) {
  if (item.IdCliente === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdCliente, item);
  }
}


async function BuscarTypeahead(Nombre) {
  const resp = await httpService.get(urlResource + "/typeahead", {
    params: { Nombre },
    headers: { 'NoBloquearPantalla': '1' },
  });
  return resp.data;
}


export const clientesService = {
  Buscar,
  BuscarPorId,
  ActivarDesactivar,
  Grabar,
  BuscarTypeahead,
};
