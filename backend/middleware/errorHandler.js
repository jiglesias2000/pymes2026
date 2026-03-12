// Middleware de errores centralizado de Express
// Firma especial: 4 parámetros (err, req, res, next)
function errorHandler(err, req, res, next) {
  console.error("Error no controlado:", err);
  res.status(500).json({
    error: true,
    mensaje: "Error interno del servidor",
  });
}

module.exports = errorHandler;
