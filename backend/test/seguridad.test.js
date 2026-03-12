const request = require("supertest");
const app = require("../index");

const usuarioRolJefe = { usuario: "admin", clave: "123" };
const usuarioRolEmpleado = { usuario: "juan", clave: "123" };


describe("POST /api/login admin", function () {
  it("Devolveria error de autenticacion, porque tiene clave errónea", async function () {
    const res = await request(app)
      .post("/api/login")
      //.set("Content-type", "application/json")
      .send({ usuario: "admin", clave: "errónea" });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("usuario o clave incorrecto");
  });

  it("Devolvería el token para usuario admin", async function () {
    const res = await request(app).post("/api/login").send(usuarioRolJefe);

    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });
});

describe("GET /api/usuarios", () => {

  it("Devolveria error, porque falta token de autorización", async function () {
    const res = await request(app).get("/api/usuarios");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Acceso denegado");
  });

  it("Devolveria error, porque el token no es válido", async function () {
    const res = await request(app).get("/api/usuarios")
    .set("Authorization", 'Bearer invalido');
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("token no es valido");
  });

  it("Devolvería todos los articulos, solo autorizado para jefes", async function () {
    const res1 = await request(app)
    .post("/api/login")
    .set("Content-type", "application/json")
    .send(usuarioRolJefe);
    expect(res1.statusCode).toEqual(200);
    let token = res1.body.accessToken;

    const res = await request(app)
      .get("/api/usuarios")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdUsuario: expect.any(Number),
          Nombre: expect.any(String),
          Clave: expect.any(String),
          Rol: expect.any(String),

        }),
      ])
    );
  });

  it("Devolvería error de autorizacion, porque solo están autorizados los jefes", async function () {
    const res1 = await request(app)
    .post("/api/login")
    .set("Content-type", "application/json")
    .send(usuarioRolEmpleado);
    expect(res1.statusCode).toEqual(200);
    let token = res1.body.accessToken;

    const res = await request(app)
      .get("/api/usuarios")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('usuario no autorizado!');
  });

});

