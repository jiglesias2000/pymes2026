// Se ejecuta en cada worker de Jest antes de los tests
// Espera a que la base de datos esté inicializada
const app = require("../index");

beforeAll(async () => {
  await app.locals.dbReady;
});
