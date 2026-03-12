import React, { useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import { ventasService } from "../../services/ventas.service";
import { clientesService } from "../../services/clientes.service";
import { articulosService } from "../../services/articulos.service";
import modalDialogService from "../../services/modalDialog.service";


function Ventas() {
  const [Fecha, setFecha] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [Cliente, setCliente] = useState(null); // { IdCliente, Nombre }
  const [ClienteBusqueda, setClienteBusqueda] = useState("");
  const [ClientesLista, setClientesLista] = useState([]);
  const [ArticuloBusqueda, setArticuloBusqueda] = useState("");
  const [ArticulosLista, setArticulosLista] = useState([]);
  const [Items, setItems] = useState([]);

  const clienteTimeoutRef = useRef(null);
  const articuloTimeoutRef = useRef(null);
  const articuloInputRef = useRef(null);


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


  // Buscar artículos con debounce
  const buscarArticulos = useCallback(async (nombre) => {
    if (nombre.length < 3) {
      setArticulosLista([]);
      return;
    }
    try {
      const data = await articulosService.BuscarTypeahead(nombre);
      setArticulosLista(data.Items || []);
    } catch (error) {
      setArticulosLista([]);
    }
  }, []);

  function handleArticuloChange(e) {
    const valor = e.target.value;
    setArticuloBusqueda(valor);
    if (articuloTimeoutRef.current) clearTimeout(articuloTimeoutRef.current);
    articuloTimeoutRef.current = setTimeout(() => buscarArticulos(valor), 300);
  }

  function seleccionarArticulo(art) {
    // si ya existe, sumar cantidad
    const idx = Items.findIndex(i => i.IdArticulo === art.IdArticulo);
    if (idx >= 0) {
      const newItems = [...Items];
      newItems[idx] = { ...newItems[idx], Cantidad: newItems[idx].Cantidad + 1 };
      setItems(newItems);
    } else {
      setItems([
        { IdArticulo: art.IdArticulo, Nombre: art.Nombre, Cantidad: 1, Precio: art.Precio },
        ...Items,
      ]);
    }
    setArticuloBusqueda("");
    setArticulosLista([]);
    if (articuloInputRef.current) articuloInputRef.current.focus();
  }


  // Operaciones sobre items
  function CambiarCantidad(index, cuanto) {
    const newItems = [...Items];
    newItems[index] = { ...newItems[index], Cantidad: newItems[index].Cantidad + cuanto };
    if (newItems[index].Cantidad < 1) return;
    setItems(newItems);
  }

  function Eliminar(index) {
    setItems(Items.filter((_, i) => i !== index));
  }

  // Totales
  const TotalCantidad = Items.reduce((acc, item) => acc + item.Cantidad, 0);
  const TotalPrecio = Items.reduce((acc, item) => acc + item.Precio * item.Cantidad, 0);


  // Grabar venta
  async function Grabar() {
    if (!Fecha) {
      modalDialogService.Alert("Fecha es requerida");
      return;
    }
    if (!Cliente) {
      modalDialogService.Alert("Debe seleccionar un cliente");
      return;
    }
    if (Items.length === 0) {
      modalDialogService.Alert("Debe agregar al menos un artículo");
      return;
    }

    const Venta = {
      IdVenta: 0,
      IdCliente: Cliente.IdCliente,
      Fecha: new Date(Fecha).toISOString(),
      Total: TotalPrecio,
    };
    const VentasDetalle = Items.map(item => ({
      IdArticulo: item.IdArticulo,
      Nombre: item.Nombre,
      Cantidad: item.Cantidad,
      Precio: item.Precio,
    }));

    try {
      await ventasService.Grabar(Venta, VentasDetalle);
      modalDialogService.Alert("Venta grabada correctamente.");
      // reset
      setFecha(dayjs(new Date()).format("YYYY-MM-DD"));
      setCliente(null);
      setClienteBusqueda("");
      setItems([]);
    } catch (error) {
      modalDialogService.Alert(error?.response?.data?.message ?? error.toString());
    }
  }


  return (
    <div>
      <div className="tituloPagina">Ventas <small>(Nueva venta)</small></div>

      {/* Formulario de cabecera */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="fa fa-shopping-cart me-2"></i>
          Datos de la Venta
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Fecha */}
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="ventaFecha"
                  value={Fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                <label htmlFor="ventaFecha">
                  Fecha<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            {/* Cliente (typeahead) */}
            <div className="col-md-4" style={{ position: "relative" }}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="ventaCliente"
                  placeholder="Cliente"
                  value={ClienteBusqueda}
                  onChange={handleClienteChange}
                />
                <label htmlFor="ventaCliente">
                  Cliente<span className="text-danger">*</span> (min 3 caracteres)
                </label>
              </div>
              {Cliente && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-info mt-1"
                  title="Info del cliente"
                  onClick={() =>
                    modalDialogService.Alert(
                      `IdCliente: ${Cliente.IdCliente}\nNombre: ${Cliente.Nombre}`,
                      "Info Cliente"
                    )
                  }
                >
                  <i className="fa fa-info-circle me-1"></i>
                  {Cliente.Nombre}
                </button>
              )}
              {ClientesLista.length > 0 && !Cliente && (
                <ul className="list-group" style={{ position: "absolute", zIndex: 1000, width: "100%" }}>
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

            {/* Agregar Artículo (typeahead) */}
            <div className="col-md-4" style={{ position: "relative" }}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="ventaArticulo"
                  placeholder="Agregar Artículo"
                  value={ArticuloBusqueda}
                  onChange={handleArticuloChange}
                  ref={articuloInputRef}
                />
                <label htmlFor="ventaArticulo">
                  Agregar Artículo<span className="text-danger">*</span> (min 3 car.)
                </label>
              </div>
              {ArticulosLista.length > 0 && (
                <ul className="list-group" style={{ position: "absolute", zIndex: 1000, width: "100%" }}>
                  {ArticulosLista.map((art) => (
                    <li
                      key={art.IdArticulo}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onClick={() => seleccionarArticulo(art)}
                    >
                      {art.Nombre} - ${art.Precio}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de artículos agregados */}
      <div className="card shadow-sm mt-3">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="fa fa-list me-2"></i>
            Detalle de Artículos
          </span>
        
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-center">Nombre</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Subtotal</th>
                  <th className="text-center text-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Items.map((item, index) => (
                  <tr key={item.IdArticulo}>
                    <td>{item.Nombre.toUpperCase()}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Quitar 1"
                        onClick={() => CambiarCantidad(index, -1)}
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                      <span className="badge bg-secondary">{item.Cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-primary ms-1"
                        title="Agregar 1"
                        onClick={() => CambiarCantidad(index, 1)}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </td>
                    <td className="text-end">${item.Precio.toFixed(2)}</td>
                    <td className="text-end">${(item.Precio * item.Cantidad).toFixed(2)}</td>
                    <td className="text-center text-nowrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        onClick={() => Eliminar(index)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {Items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      <i className="fa fa-info-circle me-1"></i>
                      Busque y seleccione artículos para agregar a la venta
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer">
          <div className="row align-items-center">
            <div className="col-auto">
              <span className="badge bg-secondary">
                Items: {TotalCantidad}
              </span>
            </div>
            <div className="col text-center">
              <span className="badge bg-dark fs-6">
                Total: ${TotalPrecio.toFixed(2)}
              </span>
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-success"
                onClick={Grabar}
              >
                <i className="fa fa-check me-1"></i>
                Grabar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Ventas };
