import { createContext, useState } from "react";
import httpService from "../services/http.service";
import { config } from "../config";
import modalService from "../services/modalDialog.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarioLogueado, setUsuarioLogueado] = useState(
    sessionStorage.getItem("usuarioLogueado")
  );
  const [rolLogueado, setRolLogueado] = useState(
    sessionStorage.getItem("rolLogueado")
  );

  const login = async (usuario, clave, navigateToComponent) => {
    const resp = await httpService.post(config.urlServidor + "/api/login", {
      usuario,
      clave,
    });

    if (resp.data?.accessToken) {
      const payload = JSON.parse(atob(resp.data.accessToken.split('.')[1]));
      sessionStorage.setItem("usuarioLogueado", usuario);
      sessionStorage.setItem("accessToken", resp.data.accessToken);
      sessionStorage.setItem("refreshToken", resp.data.refreshToken);
      sessionStorage.setItem("rolLogueado", payload.rol);
      setUsuarioLogueado(usuario);
      setRolLogueado(payload.rol);
      navigateToComponent();
    } else {
      modalService.Alert("Usuario o clave incorrectos");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("rolLogueado");
    setUsuarioLogueado(null);
    setRolLogueado(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioLogueado, rolLogueado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
