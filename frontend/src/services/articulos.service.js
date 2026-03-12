import httpService from "./http.service";
import { config } from "../config";
//const urlResource = "https://labsys.frc.utn.edu.ar/dds-backend-2025/api/articulos";
//const urlResource = "http://localhost:3000/api/articulos";
const urlResource = config.urlResourceArticulos;




async function Buscar(Nombre, Activo, Pagina) {
  
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  
  return resp.data;
}




async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdArticulo);
  return resp.data;
}




async function ActivarDesactivar(item) {
  await httpService.delete(urlResource + "/" + item.IdArticulo);
}




async function Grabar(item) {
  if (item.IdArticulo === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdArticulo, item);
  }
}


async function BuscarTypeahead(Nombre) {
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo: true, Pagina: 1 },
    headers: { 'NoBloquearPantalla': '1' },
  });
  return resp.data;
}


export const articulosService = {
  Buscar,BuscarPorId,ActivarDesactivar,Grabar,BuscarTypeahead
};
