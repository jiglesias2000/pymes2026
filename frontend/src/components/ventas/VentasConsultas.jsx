import React, { useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import { ventasService } from "../../services/ventas.service";
import { clientesService } from "../../services/clientes.service";
import modalDialogService from "../../services/modalDialog.service";


function VentasConsultas() {
  const [FechaDesde, setFechaDesde] = useState(
    dayjs(new Date()).subtract(30, "day").format("YYYY-MM-DD")
  );
  const [FechaHasta, setFechaHasta] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [Cliente, setCliente] = useState(null);
  const [ClienteBusqueda, setClienteBusqueda] = useState("");
  const [ClientesLista, setClientesLista] = useState([]);

  const [Items, setItems] = useState(null); // null = no buscó, [] = sin resultados
  const [ItemSeleccionado, setItemSeleccionado] = useState(null);
  const [ItemsDetalles, setItemsDetalles] = useState(null);

  const clienteTimeoutRef = useRef(null);
  const detalleRef = useRef(null);


  // Buscar clientes con debounce
  const buscarClientes = useCallback(async (nombre) => {
    if (nombre.length < 3) {
      setClientesLista([]);
      return;
    }
    try {
      const data = await clientesService.BuscarTypeahead(nombre);
      setClientesLista(data);
    } catch (error) {
      setClientesLista([]);
    }
  }, []);

  function handleClienteChange(e) {
    const valor = e.target.value;
    setClienteBusqueda(valor);
    setCliente(null);
    if (clienteTimeoutRef.current) clearTimeout(clienteTimeoutRef.current);
    clienteTimeoutRef.current = setTimeout(() => buscarClientes(valor), 300);
  }

  function seleccionarCliente(cli) {
    setCliente(cli);
    setClienteBusqueda(cli.Nombre);
    setClientesLista([]);
  }


  // Validar fechas
  function handleFechaDesdeChange(e) {
    const valor = e.target.value;
    setFechaDesde(valor);
    if (valor > FechaHasta) {
      setFechaHasta(valor);
    }
  }


  // Consultar ventas
  async function Consultar() {
    try {
      const data = await ventasService.Consultar(
        FechaDesde,
        FechaHasta,
        Cliente?.IdCliente
      );
      setItems(data);
      setItemSeleccionado(null);
      setItemsDetalles(null);
    } catch (error) {
      modalDialogService.Alert(
        error?.response?.data?.message ?? error.toString()
      );
    }
  }


  // Ver detalle de una venta
  async function VerDetalle(item) {
    try {
      const data = await ventasService.BuscarDetalles(item.IdVenta);
      setItemSeleccionado(item);
      setItemsDetalles(data);
      // scroll al detalle
      setTimeout(() => {
        detalleRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      modalDialogService.Alert(
        error?.response?.data?.message ?? error.toString()
      );
    }
  }


  const ItemsContador = ItemsDetalles
    ? ItemsDetalles.reduce((acc, d) => acc + d.Cantidad, 0)
    : 0;


  return (
    <div>
      <div className="tituloPagina">
        Ventas <small>(Consultas)</small>
      </div>

      {/* Card de búsqueda */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="fa fa-search me-2"></i>
          Filtros de Consulta
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Fecha Desde */}
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="vcFechaDesde"
                  value={FechaDesde}
                  onChange={handleFechaDesdeChange}
                />
                <label htmlFor="vcFechaDesde">Fecha desde</label>
              </div>
            </div>

            {/* Fecha Hasta */}
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="vcFechaHasta"
                  value={FechaHasta}
                  min={FechaDesde}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
                <label htmlFor="vcFechaHasta">Fecha hasta</label>
              </div>
            </div>

            {/* Cliente (typeahead) */}
            <div className="col-md-6" style={{ position: "relative" }}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="vcCliente"
                  placeholder="Cliente"
                  value={ClienteBusqueda}
                  onChange={handleClienteChange}
                />
                <label htmlFor="vcCliente">Cliente (min 3 caracteres)</label>
              </div>
              {ClientesLista.length > 0 && !Cliente && (
                <ul
                  className="list-group"
                  style={{ position: "absolute", zIndex: 1000, width: "100%" }}
                >
                  {ClientesLista.map((cli) => (
                    <li
                      key={cli.IdCliente}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onClick={() => seleccionarCliente(cli)}
                    >
                      {cli.Nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={Consultar}
          >
            <i className="fa fa-search me-1"></i> Consultar
          </button>
        </div>
      </div>

      {/* Tabla de resultados */}
      {Items?.length > 0 && (
        <div className="card shadow-sm mt-3">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span>
              <i className="fa fa-list me-2"></i>
              Resultados
            </span>
            <span className="badge bg-light text-dark">
              {Items.length} ventas
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-sm table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Cliente</th>
                    <th className="text-center">Total</th>
                    <th className="text-center text-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Items.map((item) => (
                    <tr key={item.IdVenta}>
                      <td>
                        {dayjs(item.Fecha).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td>{item.ClienteNombre?.toUpperCase()}</td>
                      <td className="text-end">
                        ${Number(item.Total).toFixed(2)}
                      </td>
                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          title="Ver Detalle"
                          onClick={() => VerDetalle(item)}
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {Items?.length === 0 && (
        <div className="alert alert-info d-flex align-items-center mt-3">
          <i className="fa fa-info-circle me-2"></i>
          No se encontraron registros según el criterio de búsqueda seleccionado!
        </div>
      )}

      {/* Detalle de venta seleccionada */}
      {ItemsDetalles?.length > 0 && ItemSeleccionado && (
        <div className="card shadow-sm mt-3" ref={detalleRef}>
          <div className="card-header bg-primary text-white">
            <i className="fa fa-file-text me-2"></i>
            Detalle de venta del{" "}
            {dayjs(ItemSeleccionado.Fecha).format("DD/MM/YYYY")} - {" "}
            {ItemSeleccionado.ClienteNombre}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-sm table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th className="text-center">Artículo</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-center">Precio</th>
                    <th className="text-center">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ItemsDetalles.map((d, i) => (
                    <tr key={i}>
                      <td>{d.ArticuloNombre?.toUpperCase()}</td>
                      <td className="text-end">{d.Cantidad}</td>
                      <td className="text-end">
                        ${Number(d.Precio).toFixed(2)}
                      </td>
                      <td className="text-end">
                        ${(d.Precio * d.Cantidad).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="badge bg-secondary">
                  Items: {ItemsContador}
                </span>
              </div>
              <div className="col text-end">
                <span className="badge bg-dark fs-6">
                  Total: ${Number(ItemSeleccionado.Total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { VentasConsultas };
