import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Menu() {
  const { usuarioLogueado } = useContext(AuthContext);
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {/* Botón hamburguesa flotante en mobile */}
      <button
        className="sidebar-toggle no-print d-md-none"
        onClick={() => setAbierto(!abierto)}
        aria-label="Toggle menu"
      >
        <i className={abierto ? "fa fa-times" : "fa fa-bars"}></i>
      </button>

      {/* Overlay para cerrar en mobile */}
      {abierto && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setAbierto(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav className={`sidebar bg-dark no-print ${abierto ? "sidebar-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <i className="fa fa-industry me-2"></i>
          <span>Pymes</span>
        </div>

        {/* Links de navegación */}
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/inicio" onClick={() => setAbierto(false)}>
              <i className="fa fa-home"></i> <span>Inicio</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias" onClick={() => setAbierto(false)}>
              <i className="fa fa-tags"></i> <span>Categorias</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/articulos" onClick={() => setAbierto(false)}>
              <i className="fa fa-box"></i> <span>Articulos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/clientes" onClick={() => setAbierto(false)}>
              <i className="fa fa-user"></i> <span>Clientes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ventas" onClick={() => setAbierto(false)}>
              <i className="fa fa-shopping-cart"></i> <span>Ventas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ventasconsultas" onClick={() => setAbierto(false)}>
              <i className="fa fa-file-text"></i> <span>Consulta Ventas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/usuarios" title="exclusivo para jefes" onClick={() => setAbierto(false)}>
              <i className="fa fa-users"></i> <span>Usuarios</span>
            </NavLink>
          </li>
        </ul>

        {/* Sección inferior: usuario y login/logout */}
        <div className="sidebar-footer">
          {usuarioLogueado && (
            <div className="sidebar-user">
              <i className="fa fa-user-circle me-1"></i>
              {usuarioLogueado}
            </div>
          )}
          <NavLink
            to="/login/Inicio"
            className="sidebar-login-btn"
            onClick={() => setAbierto(false)}
          >
            <span className={usuarioLogueado ? "text-warning" : "text-success"}>
              <i className={usuarioLogueado ? "fa fa-sign-out" : "fa fa-sign-in"}></i>
            </span>
            {usuarioLogueado ? " Logout" : " Login"}
          </NavLink>
        </div>
      </nav>
    </>
  );
}
export { Menu };
