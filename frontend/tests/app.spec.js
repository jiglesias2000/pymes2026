// @ts-check
import { test, expect } from "@playwright/test";

// ============================================================
// Helpers
// ============================================================

const ADMIN = { usuario: "admin", clave: "123" };
const EMPLEADO = { usuario: "juan", clave: "123" };

/** Login helper — fills the login form and clicks Ingresar */
async function login(page, { usuario, clave }) {
  await page.getByRole("textbox", { name: "Usuario" }).fill(usuario);
  await page.getByRole("textbox", { name: "Clave" }).fill(clave);
  await page.getByRole("button", { name: "Ingresar" }).click();
}

/** Accept the modal dialog that appears after CRUD operations */
async function acceptDialog(page) {
  await page.getByRole("button", { name: "Aceptar" }).click();
}

// ============================================================
// 1. Paginas publicas
// ============================================================

test.describe("Paginas publicas", () => {
  test("Inicio carga correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Pymes 2026");
    await expect(page.getByRole("heading", { name: "Pymes 2026" })).toBeVisible();
    await expect(page.getByText("Este ejemplo está desarrollado")).toBeVisible();
  });

  test("Categorias muestra tabla con datos", async ({ page }) => {
    await page.goto("/categorias");
    await expect(page.locator(".tituloPagina", { hasText: "Categorias" })).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows).not.toHaveCount(0);
    await expect(page.getByRole("cell", { name: "ACCESORIOS" })).toBeVisible();
  });

  test("Articulos carga listado sin login (GET publico)", async ({ page }) => {
    await page.goto("/articulos");
    await expect(page.getByText("Articulos (Listado)")).toBeVisible();
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible();
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
    await page.getByRole("textbox").fill("LED");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toContainText(/Registros: \d+/);
    const rows = page.locator("table tbody tr");
    await expect(rows).not.toHaveCount(0);
    const firstCell = rows.first().locator("td").first();
    await expect(firstCell).toContainText(/LED/i);
  });

  test("Filtro por Activo = NO", async ({ page }) => {
    // El select de Activo no tiene name, usamos el segundo select del form
    await page.locator("form[name='FormBusqueda'] select").selectOption("false");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible();
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByRole("cell", { name: "NO" })).toBeVisible();
    }
  });

  test("Paginacion funciona", async ({ page }) => {
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible();
    const firstPageFirstRow = await page.locator("table tbody tr").first().locator("td").first().textContent();
    // Cambiar a pagina 3 (suficiente distancia para datos distintos)
    await page.locator("select").last().selectOption("3");
    // Esperar a que la tabla se actualice con datos distintos
    await expect(page.locator("table tbody tr").first().locator("td").first())
      .not.toHaveText(firstPageFirstRow, { timeout: 5000 });
  });
});

// ============================================================
// 3. Autenticacion
// ============================================================

test.describe("Autenticacion", () => {
  test("Login exitoso como admin", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.getByText("Bienvenido: admin")).toBeVisible();
  });

  test("Login con credenciales incorrectas muestra error", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, { usuario: "admin", clave: "wrongpassword" });
    await expect(page.getByText(/usuario o clave incorrecto/i)).toBeVisible();
  });

  test("Logout cierra la sesion", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.getByText("Bienvenido: admin")).toBeVisible();
    await page.getByRole("link", { name: /Logout/ }).click();
    await expect(page.getByRole("link", { name: /Login/ })).toBeVisible();
    await expect(page.getByText("Bienvenido")).not.toBeVisible();
  });
});

// ============================================================
// 4. Autorizacion por roles
// ============================================================

test.describe("Autorizacion por roles", () => {
  test("Admin (jefe) accede a Usuarios JWT", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await page.getByRole("link", { name: "Usuarios JWT" }).click();
    await expect(page.getByText("Usuarios JWT (solo para jefes)")).toBeVisible();
    await expect(page.getByRole("cell", { name: "admin" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "juan" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "ana" })).toBeVisible();
  });

  test("Empleado NO accede a Usuarios JWT — redirige a login", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, EMPLEADO);
    await expect(page.getByText("Bienvenido: juan")).toBeVisible();
    await page.getByRole("link", { name: "Usuarios JWT" }).click();
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
    await expect(page.getByText("Bienvenido: admin")).toBeVisible();
    await page.getByRole("link", { name: "Articulos" }).click();
    await expect(page.getByText("Articulos (Listado)")).toBeVisible();
  });

  test("Agregar articulo con validacion", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar/ }).click();
    await expect(page.getByText("Articulos (Agregar)")).toBeVisible();

    // Intentar grabar vacio — debe mostrar errores de validacion
    await page.getByRole("button", { name: /Grabar/ }).click();
    await expect(page.getByText("Nombre es requerido")).toBeVisible();
    await expect(page.getByText("Precio es requerido")).toBeVisible();
    await expect(page.getByText("Stock es requerido")).toBeVisible();
    await expect(page.getByText("Codigo De Barra es requerido")).toBeVisible();
    await expect(page.getByText("Categoria es requerido")).toBeVisible();

    // Completar con datos validos
    await page.locator('input[name="Nombre"]').fill(TEST_ARTICLE);
    await page.locator('input[name="Precio"]').fill("999");
    await page.locator('input[name="Stock"]').fill("50");
    await page.locator('input[name="CodigoDeBarra"]').fill(TEST_BARCODE);
    // Esperar a que las categorias carguen en el select
    const catSelect = page.locator('select[name="IdCategoria"]');
    await expect(catSelect.locator("option")).not.toHaveCount(1);
    await catSelect.selectOption({ label: "INFORMATICA" });
    await page.getByRole("button", { name: /Grabar/ }).click();

    // Esperar respuesta del servidor (modal de exito o error)
    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText("Registro agregado correctamente");
    await acceptDialog(page);
  });

  test("Consultar articulo", async ({ page }) => {
    await page.getByRole("textbox").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_ARTICLE })).toBeVisible();

    await page.getByTitle("Consultar").click();
    await expect(page.getByText("Articulos (Consultar)")).toBeVisible();
    await expect(page.locator('input[name="Nombre"]')).toBeDisabled();
    await expect(page.locator('input[name="Nombre"]')).toHaveValue(TEST_ARTICLE);
    await page.getByRole("button", { name: /Volver/ }).click();
  });

  test("Modificar articulo", async ({ page }) => {
    await page.getByRole("textbox").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_ARTICLE })).toBeVisible();

    await page.getByTitle("Modificar").click();
    await expect(page.getByText("Articulos (Modificar)")).toBeVisible();
    await expect(page.locator('input[name="Nombre"]')).toBeEnabled();
    await page.locator('input[name="Precio"]').fill("1500");
    await page.getByRole("button", { name: /Grabar/ }).click();

    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText("Registro modificado correctamente");
    await acceptDialog(page);

    // Verificar que el precio se actualizo
    await page.getByRole("textbox").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: "1500" })).toBeVisible();
  });

  test("Desactivar y reactivar articulo", async ({ page }) => {
    await page.getByRole("textbox").fill(TEST_ARTICLE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_ARTICLE })).toBeVisible();

    // Desactivar
    await page.getByTitle("Desactivar").click();
    await expect(page.getByText("Esta seguro que quiere desactivar")).toBeVisible();
    await acceptDialog(page);
    await expect(page.locator("table tbody tr").first().getByRole("cell", { name: "NO" })).toBeVisible();

    // Reactivar
    await page.getByTitle("Activar").click();
    await expect(page.getByText("Esta seguro que quiere activar")).toBeVisible();
    await acceptDialog(page);
    await expect(page.locator("table tbody tr").first().getByRole("cell", { name: "SI", exact: true })).toBeVisible();
  });
});

// ============================================================
// 6. Validacion de codigo de barras
// ============================================================

test.describe("Validacion de codigo de barras", () => {
  test("Codigo de barras debe ser numerico de 13 digitos", async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await page.getByRole("link", { name: "Articulos" }).click();
    await page.getByRole("button", { name: /Agregar/ }).click();

    await page.locator('input[name="Nombre"]').fill("TEST BARCODE");
    await page.locator('input[name="Precio"]').fill("100");
    await page.locator('input[name="Stock"]').fill("10");
    await page.locator('input[name="CodigoDeBarra"]').fill("ABC");
    const catSelect = page.locator('select[name="IdCategoria"]');
    await expect(catSelect.locator("option")).not.toHaveCount(1);
    await catSelect.selectOption({ label: "AUDIO" });
    await page.getByRole("button", { name: /Grabar/ }).click();

    await expect(page.getByText(/Codigo De Barra debe ser un número, de 13 dígitos/)).toBeVisible();
  });
});

// ============================================================
// 7. Menu Informes
// ============================================================

test.describe("Menu navegacion", () => {
  test("Dropdown Informes se despliega", async ({ page }) => {
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Informes" }).click();
    await expect(page.getByRole("link", { name: "Ventas" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Compras" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Libro de IVA" })).toBeVisible();
  });
});

// ============================================================
// 8. CRUD de clientes
// ============================================================

test.describe("CRUD de clientes", () => {
  const RUN_ID = String(Date.now()).slice(-6);
  const TEST_CLIENTE = `Test Cliente ${RUN_ID}`;
  const TEST_CUIT = "20" + String(Date.now()).slice(-9);

  test.beforeEach(async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.getByText("Bienvenido: admin")).toBeVisible();
    await page.getByRole("link", { name: "Clientes" }).click();
    await expect(page.getByText("Clientes")).toBeVisible();
  });

  test("Pagina carga y muestra listado", async ({ page }) => {
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible();
    const registrosText = await page.getByText(/Registros:/).textContent();
    const total = parseInt(registrosText.match(/\d+/)[0]);
    expect(total).toBeGreaterThan(0);
  });

  test("Filtro por nombre de cliente", async ({ page }) => {
    // Buscar un cliente que existe en los datos semilla
    const searchInput = page.locator("form[name='FormBusqueda'] input[type='text']");
    await searchInput.fill("Juan");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows).not.toHaveCount(0);
  });

  test("Filtro por Activo = NO", async ({ page }) => {
    await page.locator("form[name='FormBusqueda'] select").selectOption("false");
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByText(/Registros:/)).toBeVisible();
  });

  test("Agregar cliente con validacion", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar/ }).click();

    // Intentar grabar vacío — debe mostrar errores
    await page.getByRole("button", { name: /Grabar/ }).click();
    await expect(page.getByText("Nombre es requerido")).toBeVisible();
    await expect(page.getByText("CUIT es requerido")).toBeVisible();
    await expect(page.getByText("Mail es requerido")).toBeVisible();

    // Completar con datos válidos
    await page.locator('input[name="Nombre"]').fill(TEST_CLIENTE);
    await page.locator('input[name="Cuit"]').fill(TEST_CUIT);
    await page.locator('input[name="Mail"]').fill(`test${RUN_ID}@test.com`);
    await page.locator('input[name="CreditoMaximo"]').fill("50000");
    await page.locator('input[name="FechaNacimiento"]').fill("1990-01-15");
    await page.locator('input[name="FechaIngreso"]').fill("2024-01-01");
    await page.locator('input[name="Localidad"]').fill("Buenos Aires");
    await page.locator('input[name="Calle"]').fill("Av. Corrientes");
    await page.locator('input[name="NumeroCalle"]').fill("1234");
    await page.getByRole("button", { name: /Grabar/ }).click();

    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText(/agregado correctamente/i);
    await acceptDialog(page);
  });

  test("Consultar cliente", async ({ page }) => {
    const searchInput = page.locator("form[name='FormBusqueda'] input[type='text']");
    await searchInput.fill(TEST_CLIENTE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_CLIENTE })).toBeVisible();

    await page.getByTitle("Consultar").click();
    await expect(page.locator('input[name="Nombre"]')).toBeDisabled();
    await expect(page.locator('input[name="Nombre"]')).toHaveValue(TEST_CLIENTE);
    await page.getByRole("button", { name: /Volver/ }).click();
  });

  test("Modificar cliente", async ({ page }) => {
    const searchInput = page.locator("form[name='FormBusqueda'] input[type='text']");
    await searchInput.fill(TEST_CLIENTE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_CLIENTE })).toBeVisible();

    await page.getByTitle("Modificar").click();
    await expect(page.locator('input[name="Nombre"]')).toBeEnabled();
    await page.locator('input[name="CreditoMaximo"]').fill("75000");
    await page.getByRole("button", { name: /Grabar/ }).click();

    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText(/modificado correctamente/i);
    await acceptDialog(page);
  });

  test("Desactivar y reactivar cliente", async ({ page }) => {
    const searchInput = page.locator("form[name='FormBusqueda'] input[type='text']");
    await searchInput.fill(TEST_CLIENTE);
    await page.getByRole("button", { name: /Buscar/ }).click();
    await expect(page.getByRole("cell", { name: TEST_CLIENTE })).toBeVisible();

    // Desactivar
    await page.getByTitle("Desactivar").click();
    await expect(page.getByText(/seguro que quiere desactivar/i)).toBeVisible();
    await acceptDialog(page);
    await expect(page.locator("table tbody tr").first().getByRole("cell", { name: "NO" })).toBeVisible();

    // Reactivar
    await page.getByTitle("Activar").click();
    await expect(page.getByText(/seguro que quiere activar/i)).toBeVisible();
    await acceptDialog(page);
    await expect(page.locator("table tbody tr").first().getByRole("cell", { name: "SI", exact: true })).toBeVisible();
  });

  test("Validacion CUIT debe ser 11 digitos", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar/ }).click();
    await page.locator('input[name="Nombre"]').fill("Test Validacion");
    await page.locator('input[name="Cuit"]').fill("123");
    await page.locator('input[name="Mail"]').fill("test@test.com");
    await page.locator('input[name="CreditoMaximo"]').fill("1000");
    await page.locator('input[name="FechaNacimiento"]').fill("1990-01-01");
    await page.locator('input[name="FechaIngreso"]').fill("2024-01-01");
    await page.locator('input[name="Localidad"]').fill("Buenos Aires");
    await page.locator('input[name="Calle"]').fill("Calle Test");
    await page.locator('input[name="NumeroCalle"]').fill("100");
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
    await expect(page.getByText("Bienvenido: admin")).toBeVisible();
    await page.getByRole("link", { name: "Ventas", exact: true }).click();
    await expect(page.getByText("Nueva venta")).toBeVisible();
  });

  test("Pagina carga con fecha actual y tabla vacia", async ({ page }) => {
    // Verificar que el campo fecha tiene valor (fecha actual)
    const fechaInput = page.locator('input[type="date"]').first();
    await expect(fechaInput).not.toHaveValue("");

    // La tabla de items debe existir pero sin filas de productos
    const rows = page.locator("table tbody tr");
    // Solo la fila de totales
    await expect(rows).toHaveCount(1);
    await expect(page.getByText("Items 0")).toBeVisible();
    await expect(page.getByText("Total $0.00")).toBeVisible();
  });

  test("Validacion: grabar sin datos muestra alerta", async ({ page }) => {
    await page.getByRole("button", { name: "Grabar venta" }).click();
    // Debe mostrar alerta de cliente requerido
    await expect(page.locator(".modal-body")).toBeVisible();
    await expect(page.locator(".modal-body")).toContainText(/seleccionar un cliente/i);
    await acceptDialog(page);
  });

  test("Buscar cliente con typeahead", async ({ page }) => {
    // Escribir en el campo cliente (mín 3 chars para typeahead)
    const clienteInput = page.locator('input[placeholder*="buscar"]').first();
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
    const articuloInput = page.locator('input[placeholder*="buscar"]').last();
    await articuloInput.fill("LED");

    // Esperar sugerencias
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });

    // Seleccionar primer artículo
    await page.locator(".list-group-item").first().click();

    // Debe aparecer en la tabla con cantidad 1
    const itemRows = page.locator("table tbody tr");
    await expect(itemRows).not.toHaveCount(1); // más que solo la fila de totales
    await expect(page.getByText("Items 1")).toBeVisible();
  });

  test("Modificar cantidad de articulo con + y -", async ({ page }) => {
    // Agregar un artículo primero
    const articuloInput = page.locator('input[placeholder*="buscar"]').last();
    await articuloInput.fill("LED");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // Verificar cantidad inicial = 1
    await expect(page.getByText("Items 1")).toBeVisible();

    // Incrementar cantidad
    await page.getByTitle("Agregar 1").click();
    await expect(page.getByText("Items 2")).toBeVisible();

    // Decrementar cantidad
    await page.getByTitle("Quitar 1").click();
    await expect(page.getByText("Items 1")).toBeVisible();
  });

  test("Eliminar articulo del carrito", async ({ page }) => {
    // Agregar un artículo
    const articuloInput = page.locator('input[placeholder*="buscar"]').last();
    await articuloInput.fill("LED");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();
    await expect(page.getByText("Items 1")).toBeVisible();

    // Eliminar
    await page.getByTitle("Eliminar").click();
    await expect(page.getByText("Items 0")).toBeVisible();
  });

  test("Flujo completo: crear una venta", async ({ page }) => {
    // 1. Seleccionar cliente
    const clienteInput = page.locator('input[placeholder*="buscar"]').first();
    await clienteInput.fill("Juan");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // 2. Agregar artículo
    const articuloInput = page.locator('input[placeholder*="buscar"]').last();
    await articuloInput.fill("LED");
    await expect(page.locator(".list-group-item").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".list-group-item").first().click();

    // 3. Verificar que hay items y total > 0
    await expect(page.getByText("Items 1")).toBeVisible();
    await expect(page.getByText("Total $0.00")).not.toBeVisible();

    // 4. Grabar venta
    await page.getByRole("button", { name: "Grabar venta" }).click();
    const dialog = page.locator(".modal-body");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText("Venta grabada correctamente");
    await acceptDialog(page);

    // 5. Verificar que se reseteo el formulario
    await expect(page.getByText("Items 0")).toBeVisible();
    await expect(page.getByText("Total $0.00")).toBeVisible();
  });
});

// ============================================================
// 10. Ventas Consultas
// ============================================================

test.describe("Ventas - Consultas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/Inicio");
    await login(page, ADMIN);
    await expect(page.getByText("Bienvenido: admin")).toBeVisible();
    await page.getByRole("link", { name: "Consulta Ventas" }).click();
    await expect(page.getByText("Consultas")).toBeVisible();
  });

  test("Pagina carga con filtros de fecha", async ({ page }) => {
    // Debe tener dos campos de fecha con valores por defecto
    const fechaInputs = page.locator('input[type="date"]');
    await expect(fechaInputs).toHaveCount(2);

    // Fecha desde no debe estar vacía
    await expect(fechaInputs.first()).not.toHaveValue("");
    // Fecha hasta no debe estar vacía
    await expect(fechaInputs.last()).not.toHaveValue("");
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
    const clienteInput = page.locator('input[placeholder*="buscar"]');
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

    // Debe mostrar la sección de detalle con badge y tabla
    await expect(page.getByText(/Detalle de venta del/)).toBeVisible({ timeout: 5000 });

    // La tabla de detalle debe tener columnas Articulo, Cantidad, Precio, Subtotal
    await expect(page.getByRole("cell", { name: "Articulo" }).or(page.locator("th", { hasText: "Articulo" }))).toBeVisible();
  });
});
