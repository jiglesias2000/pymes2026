import { useForm } from "react-hook-form";

export default function ClientesRegistro({
  AccionABMC,
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
      ? "Nuevo Cliente"
      : AccionABMC === "M"
        ? "Modificar Cliente"
        : "Consultar Cliente";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="articulo-card">
      <div className="card shadow">
        {/* Card Header */}
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="fa fa-user me-2"></i>
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
                        value: 4,
                        message: "Nombre debe tener al menos 4 caracteres",
                      },
                      maxLength: {
                        value: 55,
                        message: "Nombre debe tener como máximo 55 caracteres",
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

                {/* CUIT */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="Cuit"
                    placeholder="CUIT"
                    {...register("Cuit", {
                      required: { value: true, message: "CUIT es requerido" },
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "CUIT debe ser numérico de 11 dígitos sin guiones",
                      },
                    })}
                    className={
                      "form-control " + (errors?.Cuit ? "is-invalid" : "")
                    }
                  />
                  <label htmlFor="Cuit">
                    CUIT<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">{errors?.Cuit?.message}</div>
                </div>

                {/* Mail */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="Mail"
                    placeholder="Mail"
                    {...register("Mail", {
                      required: { value: true, message: "Mail es requerido" },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Mail debe tener formato de email válido",
                      },
                    })}
                    className={
                      "form-control " + (errors?.Mail ? "is-invalid" : "")
                    }
                  />
                  <label htmlFor="Mail">
                    Mail<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">{errors?.Mail?.message}</div>
                </div>

                {/* Credito Maximo y Fecha Nacimiento lado a lado */}
                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        step=".01"
                        id="CreditoMaximo"
                        placeholder="Credito Maximo"
                        {...register("CreditoMaximo", {
                          required: { value: true, message: "Credito Maximo es requerido" },
                          min: {
                            value: 0.01,
                            message: "Credito Maximo debe ser mayor a 0",
                          },
                          max: {
                            value: 99999999.99,
                            message: "Credito Maximo debe ser menor o igual a 99999999.99",
                          },
                        })}
                        className={
                          "form-control " + (errors?.CreditoMaximo ? "is-invalid" : "")
                        }
                      />
                      <label htmlFor="CreditoMaximo">
                        Credito Max.<span className="text-danger">*</span>
                      </label>
                      <div className="invalid-feedback">
                        {errors?.CreditoMaximo?.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <input
                        type="date"
                        id="FechaNacimiento"
                        placeholder="Fecha Nacimiento"
                        {...register("FechaNacimiento", {
                          required: {
                            value: true,
                            message: "Fecha Nacimiento es requerida",
                          },
                        })}
                        className={
                          "form-control " +
                          (errors?.FechaNacimiento ? "is-invalid" : "")
                        }
                      />
                      <label htmlFor="FechaNacimiento">
                        F. Nacimiento<span className="text-danger">*</span>
                      </label>
                      <div className="invalid-feedback">
                        {errors?.FechaNacimiento?.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6">
                {/* Fecha Ingreso */}
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    id="FechaIngreso"
                    placeholder="Fecha Ingreso"
                    {...register("FechaIngreso", {
                      required: {
                        value: true,
                        message: "Fecha Ingreso es requerida",
                      },
                    })}
                    className={
                      "form-control " +
                      (errors?.FechaIngreso ? "is-invalid" : "")
                    }
                  />
                  <label htmlFor="FechaIngreso">
                    Fecha Ingreso<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">
                    {errors?.FechaIngreso?.message}
                  </div>
                </div>

                {/* Localidad */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="Localidad"
                    placeholder="Localidad"
                    {...register("Localidad", {
                      required: { value: true, message: "Localidad es requerida" },
                      minLength: {
                        value: 5,
                        message: "Localidad debe tener al menos 5 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message: "Localidad debe tener como máximo 50 caracteres",
                      },
                    })}
                    className={
                      "form-control " + (errors?.Localidad ? "is-invalid" : "")
                    }
                  />
                  <label htmlFor="Localidad">
                    Localidad<span className="text-danger">*</span>
                  </label>
                  <div className="invalid-feedback">
                    {errors?.Localidad?.message}
                  </div>
                </div>

                {/* Calle y Numero lado a lado */}
                <div className="row g-3">
                  <div className="col-8">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        id="Calle"
                        placeholder="Calle"
                        {...register("Calle", {
                          required: { value: true, message: "Calle es requerida" },
                          minLength: {
                            value: 5,
                            message: "Calle debe tener al menos 5 caracteres",
                          },
                          maxLength: {
                            value: 50,
                            message: "Calle debe tener como máximo 50 caracteres",
                          },
                        })}
                        className={
                          "form-control " + (errors?.Calle ? "is-invalid" : "")
                        }
                      />
                      <label htmlFor="Calle">
                        Calle<span className="text-danger">*</span>
                      </label>
                      <div className="invalid-feedback">
                        {errors?.Calle?.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        id="NumeroCalle"
                        placeholder="Numero"
                        {...register("NumeroCalle", {
                          required: {
                            value: true,
                            message: "Numero de Calle es requerido",
                          },
                          pattern: {
                            value: /^[0-9]{1,5}$/,
                            message: "Numero de Calle debe ser numérico, de 1 a 5 dígitos",
                          },
                        })}
                        className={
                          "form-control " + (errors?.NumeroCalle ? "is-invalid" : "")
                        }
                      />
                      <label htmlFor="NumeroCalle">
                        Nro.<span className="text-danger">*</span>
                      </label>
                      <div className="invalid-feedback">
                        {errors?.NumeroCalle?.message}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activo (disabled) */}
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
