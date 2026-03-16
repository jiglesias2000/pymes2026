// @ts-check
import { test, expect } from "@playwright/test";

// ============================================================
// Helpers
// ============================================================

const ADMIN = { usuario: "admin", clave: "123" };
const EMPLEADO = { usuario: "juan", clave: "123" };

/** Login helper — fills the login form and clicks Ingresar */
async function login(page, { usuario, clave }) {
  await page.locator("#usuario").fill(usuario);
  await page.locator("#clave").fill(clave);
  await page.getByRole("button", { name: "Ingresar" }).click();
}

/** Accept the modal dialog that appears after CRUD operations */
async function acceptDialog(page) {
  await page.getByRole("button", { name: "Aceptar" }).click();
}

/** Wait for the loading spinner to disappear */
async function waitForSpinner(page) {
  // Wait a bit for request to start, then wait for modal to close
  await page.waitForTimeout(300);
  await page.locator(".modal").waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
}

// ============================================================
// 1. Paginas publicas
// ============================================================

test.describe("Paginas publicas", () => {
  test("Inicio carga correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Pymes 2026");
    await expect(page.locator(".card-header", { hasText: "Pymes 2026" })).toBeVisible();
    await expect(page.getByText("Este ejemplo está desarrollado")).toBeVisible();
  });

  test("Categorias muestra tabla con datos", async ({ page }) => {
    await page.goto("/categorias");
    await expect(page.locator(".tituloPagina", { hasText: "Categorias" })).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    await expect(rows).not.toHaveCount(0);
  });

  test("Articulos carga listado sin login (GET publico)", async ({ page }) => {
    await page.goto("/articulos");
    await expect(page.getByText("Articulos")).toBeVisible();
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
    const registrosText = await page.getByText(/Registros:/).textContent();
    const total = parseInt(registrosText.match(/\d+/)[0]);
    expect(total).toBeGreaterThan(0);
  });
});

// ============================================================
// 2. Filtros de articulos
// ============================================================

test.describe("Filtros de articulos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/articulos");
  });

  test("Filtro por nombre", async ({ page }) => {
    await page.locator("#buscarNombre").fill("LED");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
    const rows = page.locator("table tbody tr");
    await expect(rows).not.toHaveCount(0);
    const firstCell = rows.first().locator("td").first();
    await expect(firstCell).toContainText(/LED/i);
  });

  test("Filtro por Activo = NO", async ({ page }) => {
    await page.locator("#buscarActivo").selectOption("false");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator("td").nth(4)).toContainText("NO");
    }
  });

  test("Paginacion funciona", async ({ page }) => {
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
    const firstPageFirstRow = await page.locator("table tbody tr").first().locator("td").first().textContent();
    // Cambiar a pagina 3 (suficiente distancia para datos distintos)
    await page.locator(".card-footer select").selectOption("3");
    // Esperar a que la tabla se actualice con datos distintos
    await expect(page.locator("table tbody tr").first().locator("td").first())
      .not.toHaveText(firstPageFirstRow, { timeout: 10000 });
  });
});

// ============================================================
// 3. Autenticacion
// ============================================================

test.describe("Autenticacion", () => {
  test("Login exitoso como admin", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    // Después del login se redirige a /inicio y el sidebar muestra el usuario
    await expect(page.locator(".sidebar-user")).toContainText("admin");
  });

  test("Login con credenciales incorrectas muestra error", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, { usuario: "admin", clave: "wrongpassword" });
    await expect(page.getByText(/usuario o clave incorrecto/i)).toBeVisible();
  });

  test("Logout cierra la sesion", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.locator(".sidebar-user")).toContainText("admin");
    // El link de logout está en el sidebar footer
    await page.locator(".sidebar-login-btn", { hasText: "Logout" }).click();
    // Después del logout, el login aparece en lugar del logout
    await expect(page.locator(".sidebar-login-btn", { hasText: "Login" })).toBeVisible();
    await expect(page.locator(".sidebar-user")).not.toBeVisible();
  });
});

// ============================================================
// 4. Autorizacion por roles
// ============================================================

test.describe("Autorizacion por roles", () => {
  test("Admin (jefe) accede a Usuarios", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.locator(".sidebar-user")).toContainText("admin");
    await page.locator(".sidebar-nav").getByRole("link", { name: "Usuarios" }).click();
    await expect(page.getByText("Usuarios JWT (solo para jefes)")).toBeVisible();
    await expect(page.getByRole("cell", { name: "admin" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "juan" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "ana" })).toBeVisible();
  });

  test("Empleado NO accede a Usuarios — redirige a login", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, EMPLEADO);
    await expect(page.locator(".sidebar-user")).toContainText("juan");
    await page.locator(".sidebar-nav").getByRole("link", { name: "Usuarios" }).click();
    // Debe redirigir al login
    await expect(page).toHaveURL(/\/login/);
  });
});

// ============================================================
// 5. CRUD de articulos (requiere login admin)
// ============================================================

test.describe("CRUD de articulos", () => {
  // Usar sufijo unico por ejecucion para evitar conflictos
  const RUN_ID = String(Date.now()).slice(-6);
  const TEST_ARTICLE = `TEST PW ${RUN_ID}`;
  const TEST_BARCODE = String(Date.now()).slice(-13).padStart(13, "0");

  test.beforeEach(async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.locator(".sidebar-user")).toContainText("admin");
    await page.locator(".sidebar-nav").getByRole("link", { name: "Articulos" }).click();
    await expect(page.locator(".tituloPagina")).toContainText("Articulos");
  });

  test("Agregar articulo con validacion", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar/ }).click();
    await expect(page.locator(".tituloPagina")).toContainText("Articulos (Agregar)");

    // Intentar grabar vacio — debe mostrar errores de validacion
    await page.getByRole("button", { name: /Grabar/ }).click();
    // La alerta general de validación debe aparecer
    await expect(page.getByText("Revisar los datos ingresados")).toBeVisible();
    // Los campos Precio, Stock, CodigoDeBarra, Categoria muestran sus errores
    await expect(page.getByText("Precio es requerido")).toBeVisible();
    await expect(page.getByText("Stock es requerido")).toBeVisible();
    await expect(page.getByText("Codigo De Barra es requerido")).toBeVisible();
    await expect(page.getByText("Categoria es requerido")).toBeVisible();

    // Completar con datos validos
    await page.locator("#Nombre").fill(TEST_ARTICLE);
    await page.locator("#Precio").fill("999");
    await page.locator("#Stock").fill("50");
    await page.locator("#CodigoDeBarra").fill(TEST_BARCODE);
    // Esperar a que las categorias carguen en el select
    const catSelect = page.locator("#IdCategoria");
    await expect(catSelect.locator("option")).not.toHaveCount(1);
    await catSelect.selectOption({ label: "INFORMATICA" });
    await page.getByRole("button", { name: /Grabar/ }).click();

    // Esperar respuesta del servidor (modal de exito)
    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText("Registro agregado correctamente");
    await acceptDialog(page);
  });

  test("Consultar articulo", async ({ page }) => {
    await page.locator("#buscarNombre").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_ARTICLE })).toBeVisible({ timeout: 10000 });

    await page.getByTitle("Consultar").click();
    await expect(page.locator(".tituloPagina")).toContainText("Articulos (Consultar)");
    await expect(page.locator("#Nombre")).toBeDisabled();
    await expect(page.locator("#Nombre")).toHaveValue(TEST_ARTICLE);
    await page.getByRole("button", { name: /Volver/ }).click();
  });

  test("Modificar articulo", async ({ page }) => {
    await page.locator("#buscarNombre").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_ARTICLE })).toBeVisible({ timeout: 10000 });

    await page.getByTitle("Modificar").click();
    await expect(page.locator(".tituloPagina")).toContainText("Articulos (Modificar)");
    await expect(page.locator("#Nombre")).toBeEnabled();
    await page.locator("#Precio").fill("1500");
    await page.getByRole("button", { name: /Grabar/ }).click();

    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText("Registro modificado correctamente");
    await acceptDialog(page);

    // Verificar que el precio se actualizo
    await page.locator("#buscarNombre").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: "1500" })).toBeVisible({ timeout: 10000 });
  });

  test("Desactivar y reactivar articulo", async ({ page }) => {
    await page.locator("#buscarNombre").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_ARTICLE })).toBeVisible({ timeout: 10000 });

    // Desactivar
    await page.getByTitle("Desactivar").click();
    await expect(page.getByText("Esta seguro que quiere desactivar")).toBeVisible();
    await acceptDialog(page);
    // Esperar a que la tabla se actualice
    await expect(page.locator("table tbody tr").first().locator(".badge.bg-danger", { hasText: "NO" })).toBeVisible({ timeout: 10000 });

    // Reactivar
    await page.getByTitle("Activar").click();
    await expect(page.getByText("Esta seguro que quiere activar")).toBeVisible();
    await acceptDialog(page);
    await expect(page.locator("table tbody tr").first().locator(".badge.bg-success", { hasText: "SI" })).toBeVisible({ timeout: 10000 });
  });
});

// ============================================================
// 6. Validacion de codigo de barras
// ============================================================

test.describe("Validacion de codigo de barras", () => {
  test("Codigo de barras debe ser numerico de 13 digitos", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await page.locator(".sidebar-nav").getByRole("link", { name: "Articulos" }).click();
    await page.getByRole("button", { name: /Agregar/ }).click();

    await page.locator("#Nombre").fill("TEST BARCODE");
    await page.locator("#Precio").fill("100");
    await page.locator("#Stock").fill("10");
    await page.locator("#CodigoDeBarra").fill("ABC");
    const catSelect = page.locator("#IdCategoria");
    await expect(catSelect.locator("option")).not.toHaveCount(1);
    await catSelect.selectOption({ label: "AUDIO" });
    await page.getByRole("button", { name: /Grabar/ }).click();

    await expect(page.getByText(/Codigo De Barra debe ser un número, de 13 dígitos/)).toBeVisible();
  });
});

// ============================================================
// 7. Menu navegacion
// ============================================================

test.describe("Menu navegacion", () => {
  test("Links del sidebar navegan correctamente", async ({ page }) => {
    await page.goto("/inicio");
    // Verificar links del sidebar
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Inicio" })).toBeVisible();
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Categorias" })).toBeVisible();
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Articulos" })).toBeVisible();
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Clientes" })).toBeVisible();
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Ventas" })).toBeVisible();
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Consulta Ventas" })).toBeVisible();
    await expect(page.locator(".sidebar-nav").getByRole("link", { name: "Usuarios" })).toBeVisible();

    // Navegar a Categorias
    await page.locator(".sidebar-nav").getByRole("link", { name: "Categorias" }).click();
    await expect(page).toHaveURL(/\/categorias/);
    await expect(page.locator(".tituloPagina")).toContainText("Categorias");
  });
});

// ============================================================
// 8. CRUD de clientes
// ============================================================

test.describe("CRUD de clientes", () => {
  const RUN_ID = String(Date.now()).slice(-6);
  // El backend convierte Nombre a UPPERCASE via hook beforeValidate
  const TEST_CLIENTE = `TEST CLIENTE PW ${RUN_ID}`;
  const TEST_CUIT = "20" + String(Date.now()).slice(-9);

  test.beforeEach(async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.locator(".sidebar-user")).toContainText("admin");
    await page.locator(".sidebar-nav").getByRole("link", { name: "Clientes" }).click();
    await expect(page.locator(".tituloPagina")).toContainText("Clientes");
  });

  test("Pagina carga y muestra listado", async ({ page }) => {
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
    const registrosText = await page.getByText(/Registros:/).textContent();
    const total = parseInt(registrosText.match(/\d+/)[0]);
    expect(total).toBeGreaterThan(0);
  });

  test("Filtro por nombre de cliente", async ({ page }) => {
    await page.locator("#buscarNombreCliente").fill("Juan");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
    const rows = page.locator("table tbody tr");
    await expect(rows).not.toHaveCount(0);
  });

  test("Filtro por Activo = NO", async ({ page }) => {
    await page.locator("#buscarActivoCliente").selectOption("false");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible({ timeout: 10000 });
  });

  test("Agregar cliente con validacion", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar/ }).click();

    // Intentar grabar vacío — debe mostrar alerta de validación
    await page.getByRole("button", { name: /Grabar/ }).click();
    await expect(page.getByText("Revisar los datos ingresados")).toBeVisible();

    // Completar con datos válidos
    await page.locator("#Nombre").fill(TEST_CLIENTE);
    await page.locator("#Cuit").fill(TEST_CUIT);
    await page.locator("#Mail").fill(`test${RUN_ID}@test.com`);
    await page.locator("#CreditoMaximo").fill("50000");
    await page.locator("#FechaNacimiento").fill("1990-01-15");
    await page.locator("#FechaIngreso").fill("2024-01-01");
    await page.locator("#Localidad").fill("Buenos Aires");
    await page.locator("#Calle").fill("Av. Corrientes");
    await page.locator("#NumeroCalle").fill("1234");
    await page.getByRole("button", { name: /Grabar/ }).click();

    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText(/agregado correctamente/i);
    await acceptDialog(page);
  });

  test("Consultar cliente", async ({ page }) => {
    await page.locator("#buscarNombreCliente").fill(TEST_CLIENTE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    const targetRow = page.locator("table tbody tr", { hasText: TEST_CLIENTE });
    await expect(targetRow.first()).toBeVisible({ timeout: 10000 });

    await targetRow.first().getByTitle("Consultar").click();
    await expect(page.locator("#Nombre")).toBeDisabled();
    await expect(page.locator("#Nombre")).toHaveValue(TEST_CLIENTE);
    await page.getByRole("button", { name: /Volver/ }).click();
  });

  test("Modificar cliente", async ({ page }) => {
    await page.locator("#buscarNombreCliente").fill(TEST_CLIENTE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    const targetRow = page.locator("table tbody tr", { hasText: TEST_CLIENTE });
    await expect(targetRow.first()).toBeVisible({ timeout: 10000 });

    await targetRow.first().getByTitle("Modificar").click();
    await expect(page.locator("#Nombre")).toBeEnabled();
    await page.locator("#CreditoMaximo").fill("75000");
    await page.getByRole("button", { name: /Grabar/ }).click();

    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText(/modificado correctamente/i);
    await acceptDialog(page);
  });

  test("Desactivar y reactivar cliente", async ({ page }) => {
    await page.locator("#buscarNombreCliente").fill(TEST_CLIENTE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    const targetRow = page.locator("table tbody tr", { hasText: TEST_CLIENTE });
    await expect(targetRow.first()).toBeVisible({ timeout: 10000 });

    // Desactivar
    await targetRow.first().getByTitle("Desactivar").click();
    await expect(page.getByText(/seguro que quiere desactivar/i)).toBeVisible();
    await acceptDialog(page);
    // Después de desactivar, la fila sigue visible pero con badge NO
    const updatedRow = page.locator("table tbody tr", { hasText: TEST_CLIENTE });
    await expect(updatedRow.first().locator(".badge.bg-danger", { hasText: "NO" })).toBeVisible({ timeout: 10000 });

    // Reactivar
    await updatedRow.first().getByTitle("Activar").click();
    await expect(page.getByText(/seguro que quiere activar/i)).toBeVisible();
    await acceptDialog(page);
    const reactivatedRow = page.locator("table tbody tr", { hasText: TEST_CLIENTE });
    await expect(reactivatedRow.first().locator(".badge.bg-success", { hasText: "SI" })).toBeVisible({ timeout: 10000 });
  });

  test("Validacion CUIT debe ser 11 digitos", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar/ }).click();
    await page.locator("#Nombre").fill("Test Validacion");
    await page.locator("#Cuit").fill("123");
    await page.locator("#Mail").fill("test@test.com");
    await page.locator("#CreditoMaximo").fill("1000");
    await page.locator("#FechaNacimiento").fill("1990-01-01");
    await page.locator("#FechaIngreso").fill("2024-01-01");
    await page.locator("#Localidad").fill("Buenos Aires");
    await page.locator("#Calle").fill("Calle Test");
    await page.locator("#NumeroCalle").fill("100");
    await page.getByRole("button", { name: /Grabar/ }).click();

    await expect(page.getByText(/CUIT debe ser numérico de 11 dígitos/)).toBeVisible();
  });
});

// ============================================================
// 9. Ventas (Nueva venta)
// ============================================================

test.describe("Ventas - Nueva venta", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.locator(".sidebar-user")).toContainText("admin");
    await page.locator(".sidebar-nav").getByRole("link", { name: "Ventas", exact: true }).click();
    await expect(page.locator(".tituloPagina")).toContainText("Ventas");
  });

  test("Pagina carga con fecha actual y tabla vacia", async ({ page }) => {
    // Verificar que el campo fecha tiene valor (fecha actual)
    const fechaInput = page.locator("#ventaFecha");
    await expect(fechaInput).not.toHaveValue("");

    // La tabla de items debe existir con mensaje de "no hay items"
    await expect(page.getByText("Busque y seleccione artículos")).toBeVisible();
    await expect(page.getByText("Items: 0")).toBeVisible();
    await expect(page.getByText("Total: $0.00")).toBeVisible();
  });

  test("Validacion: grabar sin datos muestra alerta", async ({ page }) => {
    await page.getByRole("button", { name: "Grabar Venta" }).click();
    // Debe mostrar alerta de cliente requerido
    await expect(page.locator(".modal-body")).toBeVisible();
    await expect(page.locator(".modal-body")).toContainText(/seleccionar un cliente/i);
    await acceptDialog(page);
  });

  test("Buscar cliente con typeahead", async ({ page }) => {
    // Escribir en el campo cliente (mín 3 chars para typeahead)
    const clienteInput = page.locator("#ventaCliente");
    await clienteInput.fill("Juan");

    // Esperar que aparezca la lista de sugerencias
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });

    // Seleccionar el primer cliente
    await page.locator(".list-group-item").first().click();

    // El input debe tener el nombre del cliente seleccionado
    await expect(clienteInput).not.toHaveValue("");
  });

  test("Buscar articulo con typeahead y agregar al carrito", async ({ page }) => {
    // Buscar artículo
    const articuloInput = page.locator("#ventaArticulo");
    await articuloInput.fill("LED");

    // Esperar sugerencias
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });

    // Seleccionar primer artículo
    await page.locator(".list-group-item").first().click();

    // Debe aparecer en la tabla con cantidad 1
    await expect(page.getByText("Items: 1")).toBeVisible();
  });

  test("Modificar cantidad de articulo con + y -", async ({ page }) => {
    // Agregar un artículo primero
    const articuloInput = page.locator("#ventaArticulo");
    await articuloInput.fill("LED");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // Verificar cantidad inicial = 1
    await expect(page.getByText("Items: 1")).toBeVisible();

    // Incrementar cantidad
    await page.getByTitle("Agregar 1").click();
    await expect(page.getByText("Items: 2")).toBeVisible();

    // Decrementar cantidad
    await page.getByTitle("Quitar 1").click();
    await expect(page.getByText("Items: 1")).toBeVisible();
  });

  test("Eliminar articulo del carrito", async ({ page }) => {
    // Agregar un artículo
    const articuloInput = page.locator("#ventaArticulo");
    await articuloInput.fill("LED");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();
    await expect(page.getByText("Items: 1")).toBeVisible();

    // Eliminar
    await page.getByTitle("Eliminar").click();
    await expect(page.getByText("Items: 0")).toBeVisible();
  });

  test("Flujo completo: crear una venta", async ({ page }) => {
    // 1. Seleccionar cliente
    const clienteInput = page.locator("#ventaCliente");
    await clienteInput.fill("Juan");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // 2. Agregar artículo
    const articuloInput = page.locator("#ventaArticulo");
    await articuloInput.fill("LED");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // 3. Verificar que hay items y total > 0
    await expect(page.getByText("Items: 1")).toBeVisible();
    await expect(page.getByText("Total: $0.00")).not.toBeVisible();

    // 4. Grabar venta
    await page.getByRole("button", { name: "Grabar Venta" }).click();
    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText("Venta grabada correctamente");
    await acceptDialog(page);

    // 5. Verificar que se reseteo el formulario
    await expect(page.getByText("Items: 0")).toBeVisible();
    await expect(page.getByText("Total: $0.00")).toBeVisible();
  });
});

// ============================================================
// 10. Ventas Consultas
// ============================================================

test.describe("Ventas - Consultas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.locator(".sidebar-user")).toContainText("admin");
    await page.locator(".sidebar-nav").getByRole("link", { name: "Consulta Ventas" }).click();
    await expect(page.locator(".tituloPagina")).toContainText("Ventas");
  });

  test("Pagina carga con filtros de fecha", async ({ page }) => {
    // Debe tener dos campos de fecha con valores por defecto
    const fechaDesde = page.locator("#vcFechaDesde");
    const fechaHasta = page.locator("#vcFechaHasta");

    await expect(fechaDesde).not.toHaveValue("");
    await expect(fechaHasta).not.toHaveValue("");
  });

  test("Consultar ventas muestra resultados o mensaje vacio", async ({ page }) => {
    await page.getByRole("button", { name: /Consultar/ }).click();

    // Debe mostrar tabla de resultados o mensaje de "no se encontraron"
    const hasResults = page.locator("table tbody tr");
    const noResults = page.getByText(/No se encontraron registros/);

    // Una de las dos debe ser visible
    await expect(hasResults.first().or(noResults)).toBeVisible({ timeout: 10000 });
  });

  test("Consultar ventas con filtro de cliente", async ({ page }) => {
    // Buscar cliente
    const clienteInput = page.locator("#vcCliente");
    await clienteInput.fill("Juan");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // Consultar
    await page.getByRole("button", { name: /Consultar/ }).click();

    const hasResults = page.locator("table tbody tr");
    const noResults = page.getByText(/No se encontraron registros/);
    await expect(hasResults.first().or(noResults)).toBeVisible({ timeout: 10000 });
  });

  test("Ver detalle de una venta", async ({ page }) => {
    // Primero consultar (sin filtro de cliente para tener resultados)
    await page.getByRole("button", { name: /Consultar/ }).click();

    // Esperar a que haya resultados
    const firstRow = page.locator("table tbody tr").first();
    try {
      await expect(firstRow).toBeVisible({ timeout: 10000 });
    } catch {
      // Si no hay ventas, omitir el test
      test.skip();
      return;
    }

    // Click en "Ver Detalle" de la primera venta
    await page.getByTitle("Ver Detalle").first().click();

    // Debe mostrar la sección de detalle con fecha
    await expect(page.getByText(/Detalle de venta del/)).toBeVisible({ timeout: 5000 });

    // La tabla de detalle debe tener columna Artículo
    await expect(page.locator("th", { hasText: "Artículo" })).toBeVisible();
  });
});
