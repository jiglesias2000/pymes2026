import { useForm } from "react-hook-form";

export default function ArticulosRegistro({
  AccionABMC,
  Categorias,
  Item,
  Grabar,
  Volver,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitted },
  } = useForm({ values: Item });

  const onSubmit = (data) => {
    Grabar(data);
  };

  const titulo =
    AccionABMC === "A"
      ? "Nuevo Artículo"
      : AccionABMC === "M"
        ? "Modificar Artículo"
        : "Consultar Artículo";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="articulo-card">
      <div className="card shadow">
        {/* Card Header */}
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="fa fa-box me-2"></i>
            {titulo}
          </span>
          {AccionABMC !== "A" && Item && (
            <span
              className={
                "badge " +
                (Item.Activo ? "bg-success" : "bg-danger")
              }
            >
              {Item.Activo ? "Activo" : "Inactivo"}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body">
          <fieldset disabled={AccionABMC === "C"}>
            <div className="row g-3">
              {/* Columna izquierda */}
              <div className="col-md-6">
                {/* Nombre */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="Nombre"
                    placeholder="Nombre"
                    {...register("Nombre", {
                      required: { value: true, message: "Nombre es requerido" },
                      minLength: {
                        value: 5,
                        message: "Nombre debe tener al menos 5 caracteres",
                      },
                      maxLength: {
                        value: 60,
                        message: "Nombre debe tener como máximo 60 caracteres",
                      },
                    })}
                    autoFocus
                    className={
                      "form-control " + (errors?.Nombre ? "is-invalid" : "")
                    }
                  />
                  <label htmlFor="Nombre">
                    Nombre<span className="text-danger">*</span>
                  </label>
                  {errors?.Nombre && touchedFields.Nombre && (
                    <div className="invalid-feedback">
                      {errors?.Nombre?.message}
                    </div>
                  )}
                </div>

                {/* Precio y Stock lado a lado */}
                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        step=".01"
                        id="Precio"
                        placeholder="Precio"
                        {...register("Precio", {
                          required: { value: true, message: "Precio es requerido" },
                          min: {
                            value: 0.01,
                            message: "Precio debe ser mayor a 0",
                          },
                          max: {
                            value: 99999.99,
                            message: "Precio debe ser menor o igual a 99999.99",
                          },
                        })}
                        className={
                          "form-control " + (errors?.Precio ? "is-invalid" : "")
                        }
                      />
                      <label htmlFor="Precio">
                        Precio<span className="text-danger">*</span>
                      </label>
                      <div className="invalid-feedback">
                        {errors?.Precio?.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        id="Stock"
                        placeholder="Stock"
                        {...register("Stock", {
                          required: { value: true, message: "Stock es requerido" },
                          min: {
                            value: 0,
                            message: "Stock debe ser mayor a 0",
                          },
                          max: {
                            value: 99999,
                            message: "Stock debe ser menor o igual a 999999",
                          },
                        })}
                        className={
                          "form-control " + (errors?.Stock ? "is-invalid" : "")
                        }
                      />
                      <label htmlFor="Stock">
                        Stock<span className="text-danger">*</span>
                      </label>
                      <div className="invalid-feedback">
                        {errors?.Stock?.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6">
                {/* Código de Barra */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="CodigoDeBarra"
                    placeholder="Código de Barra"
                    {...register("CodigoDeBarra", {
                      required: {
                        value: true,
                        message: "Codigo De Barra es requerido",
                      },
                      pattern: {
                        value: /^[0-9]{13}$/,
                        message:
                          "Codigo De Barra debe ser un número, de 13 dígitos",
                      },
                    })}
                    className={
                      "form-control" + (errors?.CodigoDeBarra ? " is-invalid" : "")
                    }
                  />
                  <label htmlFor="CodigoDeBarra">
                    Código de Barra<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">
                    {errors?.CodigoDeBarra?.message}
                  </div>
                </div>

                {/* Categoría */}
                <div className="form-floating mb-3">
                  <select
                    id="IdCategoria"
                    {...register("IdCategoria", {
                      required: { value: true, message: "Categoria es requerido" },
                    })}
                    className={
                      "form-select " +
                      (errors?.IdCategoria ? "is-invalid" : "")
                    }
                  >
                    <option value=""></option>
                    {Categorias?.map((x) => (
                      <option value={x.IdCategoria} key={x.IdCategoria}>
                        {x.Nombre}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="IdCategoria">
                    Categoría<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">
                    {errors?.IdCategoria?.message}
                  </div>
                </div>

                {/* Fecha Alta */}
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    id="FechaAlta"
                    placeholder="Fecha Alta"
                    {...register("FechaAlta", {
                      required: { value: true, message: "Fecha Alta es requerido" },
                    })}
                    className={
                      "form-control " + (errors?.FechaAlta ? "is-invalid" : "")
                    }
                  />
                  <label htmlFor="FechaAlta">
                    Fecha Alta<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">
                    {errors?.FechaAlta?.message}
                  </div>
                </div>

                {/* Activo (hidden, always disabled) */}
                <div className="form-floating mb-3">
                  <select
                    id="Activo"
                    {...register("Activo", {
                      required: { value: true, message: "Activo es requerido" },
                    })}
                    className={
                      "form-select" + (errors?.Activo ? " is-invalid" : "")
                    }
                    disabled
                  >
                    <option value={null}></option>
                    <option value={false}>NO</option>
                    <option value={true}>SI</option>
                  </select>
                  <label htmlFor="Activo">
                    Activo<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">
                    {errors?.Activo?.message}
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Alerta de validación */}
          {!isValid && isSubmitted && (
            <div className="alert alert-danger d-flex align-items-center mt-3 mb-0">
              <i className="fa fa-exclamation-triangle me-2"></i>
              Revisar los datos ingresados...
            </div>
          )}
        </div>

        {/* Card Footer con botones */}
        <div className="card-footer text-center">
          <div className="botones">
            {AccionABMC !== "C" && (
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-check"></i> Grabar
              </button>
            )}
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => Volver()}
            >
              <i className="fa fa-undo"></i>
              {AccionABMC === "C" ? " Volver" : " Cancelar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
