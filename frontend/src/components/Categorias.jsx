import React, {useState, useEffect} from 'react';
//import { categoriasMockService } from '../services/categorias-mock.service';
import {categoriasService } from '../services/categorias.service';

function Categorias() {
  const tituloPagina = 'Categorias';
  const [categorias, setCategorias] = useState(null);
  // cargar al montar el componente (solo una vez)
  useEffect(() => {
    BuscarCategorias();
  }, []);
  async function BuscarCategorias() {
    let data = await categoriasService.Buscar();
    setCategorias(data);
  };
  return (
    <div>
      <div className="tituloPagina">{tituloPagina}</div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="fa fa-tags me-2"></i>
          Listado de Categorías
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "40%" }}>IdCategoria</th>
                  <th className="text-center" style={{ width: "60%" }}>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {categorias &&
                  categorias.map((categoria) => (
                    <tr key={categoria.IdCategoria}>
                      <td className="text-center">{categoria.IdCategoria}</td>
                      <td>{categoria.Nombre}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export {Categorias};
