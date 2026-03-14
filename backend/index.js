// vercel lee las variables de entorno automáticamente, pero localmente se deben cargar con dotenv??

require("dotenv").config(); // cargar variables de entorno desde .env

const express = require("express");

// crear servidor
const app = express();
const inicializarBase = require("./models/inicializarBase");  // inicializar base de datos



app.use(express.json()); // para poder leer json en el body

const cors = require("cors");
app.use(
  cors({
    origin: "*", // para que acepte peticiones de cualquier origen
  })
);

const categoriasmock = require("./routes/categoriasmock");
app.use(categoriasmock);
const categoriasRouter = require("./routes/categorias");
app.use(categoriasRouter);
const articulosRouter = require("./routes/articulos");
app.use(articulosRouter);
const seguridadRouter = require("./routes/seguridad");
app.use(seguridadRouter);
const usuariosRouter = require("./routes/usuarios");
app.use(usuariosRouter);
const clientesRouter = require("./routes/clientes");
app.use(clientesRouter);
const ventasRouter = require("./routes/ventas");
app.use(ventasRouter);


const frontendIncluidoEnPublic = false;
if (frontendIncluidoEnPublic) {
  // el siguiente bloque de codigo permite correr el front junto al back
  // para lo cual se debe tener una carpeta publica (public o pages o cualquier otra)
  // en la raiz del proyecto, con el codigo del frontend

  const path = require('path');
  // Servir archivos estáticos (JS, CSS, imágenes)
  app.use(express.static(path.join(__dirname, 'public')));
  // Ruta comodín para servir el index.html (DESPUÉS DE LAS RUTAS DE LA API)
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}
else {
  app.get("/", (req, res) => {
    res.send("Backend inicial dds-backend!");
  });
}


// middleware de errores centralizado (debe registrarse al final)
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);


// levantar servidor
const port = 3000;
app.locals.fechaInicio = new Date();  // fecha y hora inicio de aplicacion

if (require.main === module) {
  // Ejecución local: inicializar base y levantar servidor
  inicializarBase().then(() => {
    app.listen(port, () => {
      console.log(`sitio escuchando en el puerto ${port}`);
    });
  });
} else if (process.env.VERCEL) {
  // En Vercel: inicializar base (serverless, no hace listen)
  inicializarBase();
}
module.exports = app; // para testing y Vercel
