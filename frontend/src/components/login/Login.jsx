import React, { useState, useEffect, useContext } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";


function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const {componentFrom} = useParams();
  const { login, logout } = useContext(AuthContext);


  const navigateToComponent = () => {
    navigate(`/${componentFrom}`);
  };


  const handleIngresar = async () => {
    login(usuario, clave, navigateToComponent);
  };


  useEffect(() => {
    logout();
  }, []);


  return (
    <div className="login-container">
      <form className="articulo-card login-form">
        <div className="card shadow">
          <div className="card-header bg-primary text-white text-center">
            <i className="fa fa-lock me-2"></i>
            Iniciar Sesión
          </div>
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <i className="fa fa-industry fa-3x text-primary"></i>
              <h5 className="mt-2 text-muted">Pymes 2026</h5>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                autoComplete="off"
                placeholder="usuario"
                onChange={(e) => setUsuario(e.target.value)}
                value={usuario}
                autoFocus
                className="form-control"
                id="usuario"
              />
              <label className="custom-control" htmlFor="usuario">
                <i className="fa fa-user me-1"></i> Usuario
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                autoComplete="off"
                placeholder="Clave"
                onChange={(e) => setClave(e.target.value)}
                value={clave}
                className="form-control"
                id="clave"
              />
              <label className="custom-control" htmlFor="clave">
                <i className="fa fa-key me-1"></i> Clave
              </label>
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="recordarme" value="remember-me" />
              <label className="custom-control form-check-label" htmlFor="recordarme">
                Recordarme
              </label>
            </div>

            <button
              className="w-100 btn btn-primary btn-lg"
              type="button"
              onClick={() => handleIngresar()}
            >
              <i className="fa fa-sign-in me-1"></i> Ingresar
            </button>
          </div>
          <div className="card-footer text-center text-muted">
            <small>&copy; Pymes 2026</small>
          </div>
        </div>
      </form>
    </div>
  );
}
export {Login};
