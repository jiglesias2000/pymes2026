import axios from "axios";
import modalService from "./modalDialog.service";


const httpService = axios.create({
  headers: {
    "Content-type": "application/json",
  },
});


httpService.interceptors.request.use(
  (request) => {
    if (!request.headers["NoBloquearPantalla"]) {
      modalService.BloquearPantalla(true);
    }
    request._noBloquear = !!request.headers["NoBloquearPantalla"];
    delete request.headers["NoBloquearPantalla"];
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = "Bearer " + accessToken;
    }
    return request;
  },
  (error) => {
    console.log("error en axios request", error);
    return Promise.reject(error);
  }
);


httpService.interceptors.response.use(
  (response) => {
    if (!response.config._noBloquear) {
      modalService.BloquearPantalla(false);
    }
    return response;
  },
  (error) => {
    // loguear el error
    console.log("error en axios response ", error);
    if (!error.config?._noBloquear) {
      modalService.BloquearPantalla(false);
    }


    if (error.response.status === 401) {
      // no autenticado: usar mensaje del backend si existe (ej: intentos restantes), sino genérico
      error.message = error?.response?.data?.message ?? "debe loguearse para acceder a esta funcionalidad";
    } else if (error.response.status === 403) {
      // no autorizado
      error.message = "usuario no autorizado para acceder a esta funcionalidad";
    } else {
      error.message =
        error?.response?.data?.message ??
        "Actualmente tenemos inconvenientes en el servidor, por favor intente más tarde";
    }
    modalService.Alert(error.message);


    return Promise.reject(error);


    //return error
    //throw new Error(error?.response?.data?.Message ?? 'Ocurrio un error');
  }
);


export default httpService;
