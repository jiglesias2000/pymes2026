export default function ClientesBuscar({
  Nombre,
  setNombre,
  Activo,
  setActivo,
  Buscar,
  Agregar,
}) {
  return (
    <form name="FormBusqueda" className="articulo-card">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="fa fa-search me-2"></i>
          Búsqueda de Clientes
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="buscarNombreCliente"
                  placeholder="Nombre"
                  onChange={(e) => setNombre(e.target.value)}
                  value={Nombre}
                  maxLength="55"
                  autoFocus
                />
                <label htmlFor="buscarNombreCliente">Nombre</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="buscarActivoCliente"
                  onChange={(e) => setActivo(e.target.value)}
                  value={Activo}
                >
                  <option value="">Todos</option>
                  <option value="true">SI</option>
                  <option value="false">NO</option>
                </select>
                <label htmlFor="buscarActivoCliente">Activo</label>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <div className="botones">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => Buscar(1)}
            >
              <i className="fa fa-search"></i> Buscar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => Agregar()}
            >
              <i className="fa fa-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
