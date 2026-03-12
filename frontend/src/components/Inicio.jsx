import { Link } from "react-router-dom";

function Inicio() {
  return (
    <div className="mt-4">
      <div className="card shadow-sm overflow-hidden">
        <div className="card-header bg-primary text-white">
          <i className="fa fa-industry me-2"></i>
          Pymes 2026
        </div>
        <div className="card-body p-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=400&fit=crop&crop=center"
            alt="Equipo de trabajo en pequeña empresa"
            className="img-fluid w-100"
            style={{ maxHeight: "350px", objectFit: "cover" }}
          />
          <div className="p-4">
            <p>Este ejemplo está desarrollado con las siguientes tecnologías:</p>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="card border-primary h-100">
                  <div className="card-body">
                    <h6 className="card-title text-primary">
                      <i className="fa fa-server me-2"></i>Backend
                    </h6>
                    <p className="card-text mb-0">
                      NodeJs, Express, WebApiRest, Swagger, Sequelize, Sqlite y Javascript.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-primary h-100">
                  <div className="card-body">
                    <h6 className="card-title text-primary">
                      <i className="fa fa-desktop me-2"></i>Frontend
                    </h6>
                    <p className="card-text mb-0">
                      Single Page Application, HTML, CSS, Bootstrap, Javascript, NodeJs y React.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <Link to="/categorias" className="btn btn-primary me-2">
            <i className="fa fa-tags me-1"></i> Ver Categorías
          </Link>
          <Link to="/articulos" className="btn btn-outline-primary">
            <i className="fa fa-box me-1"></i> Ver Artículos
          </Link>
        </div>
      </div>
    </div>
  );
}
export { Inicio };
