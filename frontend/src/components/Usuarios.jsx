import React, { useState, useEffect } from "react";
import { usuariosService } from "../services/usuarios.service";


function Usuarios() {
  const tituloPagina = "Usuarios JWT (solo para jefes)";
  const [usuarios, setUsuarios] = useState(null);

  // cargar al iniciar el componente, solo una vez
  useEffect(() => {
    BuscarUsuarios();
  }, []);

  async function BuscarUsuarios() {
     try {
      let data = await usuariosService.Buscar();
      setUsuarios(data);
    } catch (error) {
      console.log("error al buscar datos en el servidor!")
    }
  }


  return (
    <>
      <div className="tituloPagina">{tituloPagina}</div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="fa fa-users me-2"></i>
            Listado de Usuarios
          </span>
          {usuarios && (
            <span className="badge bg-light text-dark">
              {usuarios.length} registros
            </span>
          )}
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "20%" }}>IdUsuario</th>
                  <th className="text-center" style={{ width: "50%" }}>Nombre</th>
                  <th className="text-center" style={{ width: "30%" }}>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios &&
                  usuarios.map((item) => (
                    <tr key={item.IdUsuario}>
                      <td className="text-center">{item.IdUsuario}</td>
                      <td>{item.Nombre}</td>
                      <td>
                        <span className={
                          "badge " + (item.Rol === "jefe" ? "bg-warning text-dark" : "bg-info")
                        }>
                          {item.Rol}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export { Usuarios };
