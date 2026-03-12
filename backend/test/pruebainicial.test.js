const request = require("supertest");
const app = require("../index");

describe("Ejemplo simple, de una funcion", () => {

  it("comparacion de literales", () => {
    expect("hola").toBe("hola");
  });

  it("probar suma", () => {
    expect(suma(5,6)).toBe(11);
  });
  it("probar multiplicacion", () => {
    expect(5*6).toBe(30);
  });
});

function suma(a, b) {
  return a + b;
}


// describe("GET Backend inicial dds-backend!", () => {
//   it("Debería devolver: Backend inicial dds-backend!", async () => {
//     const res = await request(app).get("/");
//     expect(res.statusCode).toEqual(200);
//     expect(res.text).toEqual('Backend inicial dds-backend!');
//   });
// });

// describe("GET _isalive", () => {
//   it("Deberia devolver ejecutándose desde ...", async () => {
//     const res = await request(app).get("/_isalive");
//     expect(res.statusCode).toEqual(200);
//     expect(res.text).toContain('Ejecutandose desde:');
//   });
// });

// describe("GET 404", () => {
//   it("Debería devolver error 404 y su texto apropiado", async () => {
//     const res = await request(app).get("/urlinexistente");
//     expect(res.statusCode).toEqual(404);
//     expect(res.text).toEqual("No encontrada!");
//   });
// });

