import React from "react";
import dayjs from "dayjs";

export default function ArticulosListado({
  Items,
  Consultar,
  Modificar,
  ActivarDesactivar,
  Imprimir,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar,
}) {
  return (
    <div className="card shadow-sm mt-3">
      <div className="card-header bg-primary text-white">
        <i className="fa fa-list me-2"></i>
        Resultados
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-sm table-striped align-middle mb-0">
            <thead>
              <tr>
                <th className="text-center">Nombre</th>
                <th className="text-center">Precio</th>
                <th className="text-center">Stock</th>
                <th className="text-center">Fecha de Alta</th>
                <th className="text-center">Activo</th>
                <th className="text-center text-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Items &&
                Items.map((Item) => (
                  <tr key={Item.IdArticulo}>
                    <td>{Item.Nombre}</td>
                    <td className="text-end">{Item.Precio}</td>
                    <td className="text-end">{Item.Stock}</td>
                    <td className="text-end">
                      {dayjs(Item.FechaAlta).format("DD/MM/YYYY")}
                    </td>
                    <td className="text-center">
                      <span
                        className={
                          "badge " +
                          (Item.Activo ? "bg-success" : "bg-danger")
                        }
                      >
                        {Item.Activo ? "SI" : "NO"}
                      </span>
                    </td>
                    <td className="text-center text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Consultar"
                        onClick={() => Consultar(Item)}
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Modificar"
                        onClick={() => Modificar(Item)}
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        className={
                          "btn btn-sm " +
                          (Item.Activo
                            ? "btn-outline-danger"
                            : "btn-outline-success")
                        }
                        title={Item.Activo ? "Desactivar" : "Activar"}
                        onClick={() => ActivarDesactivar(Item)}
                      >
                        <i
                          className={"fa fa-" + (Item.Activo ? "times" : "check")}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Paginador en el footer */}
      <div className="card-footer">
        <div className="row align-items-center">
          <div className="col-auto">
            <span className="badge bg-secondary">
              Registros: {RegistrosTotal}
            </span>
          </div>
          <div className="col text-center">
            Página: &nbsp;
            <select
              className="form-select form-select-sm d-inline-block w-auto"
              value={Pagina}
              onChange={(e) => {
                Buscar(e.target.value);
              }}
            >
              {Paginas?.map((x) => (
                <option value={x} key={x}>
                  {x}
                </option>
              ))}
            </select>
            &nbsp; de {Paginas?.length}
          </div>
          <div className="col-auto">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => Imprimir()}
            >
              <i className="fa fa-print"></i> Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
