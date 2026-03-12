import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function RequireAuth({ children, rol }) {
  const { usuarioLogueado, rolLogueado } = useContext(AuthContext);
  const location = useLocation();

  if (!usuarioLogueado) {
    return <Navigate to={"/login" + location.pathname} />;
  }

  if (rol && rolLogueado !== rol) {
    return <Navigate to={"/login" + location.pathname} />;
  }

  return children;
}

export { RequireAuth };


