import httpService from "./http.service";
import { config } from "../config";
//const urlResource = "https://labsys.frc.utn.edu.ar/dds-backend-2025/api/categorias";
// const urlResource = "http://localhost:3000/api/categorias";
const urlResource = config.urlResourceCategorias;

async function Buscar() {
  const resp = await httpService.get(urlResource);
  return resp.data;
}
export const categoriasService = {
  Buscar
};
