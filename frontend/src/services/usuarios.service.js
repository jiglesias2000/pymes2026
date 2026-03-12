import {config} from "../config";
import httpService from "./http.service";

const urlResource = config.urlResourceUsuarios;

async function Buscar() {
  const resp = await httpService.get(urlResource    );
  return resp.data;
}

export const usuariosService = {
  Buscar
};
