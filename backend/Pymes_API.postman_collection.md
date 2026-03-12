 Incluye 32 requests organizados por módulo:

  ┌─────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────┐
  │     Módulo      │ Requests │                                 Endpoints cubiertos                                  │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Seguridad       │ 4        │ login, login inválido, refresh token, logout                                         │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Artículos       │ 8        │ GET paginado, filtros (Nombre, Activo), GET por ID, POST, POST inválido, PUT, DELETE │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Categorías      │ 3        │ GET todas, GET por ID, GET inexistente (404)                                         │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Categorías Mock │ 1        │ GET mock                                                                             │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Usuarios        │ 2        │ GET con token admin, GET sin token (401)                                             │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Clientes        │ 9        │ GET paginado, filtros, GET por ID, typeahead, POST, POST inválido, PUT, DELETE       │
  ├─────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Ventas          │ 5        │ GET, filtro por cliente, filtro por fechas, POST con detalles, GET detalles          │
  └─────────────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────────┘

  Características:
  - Variables de colección baseUrl (default http://localhost:3000), accessToken y refreshToken
  - El request "Login (admin)" guarda automáticamente los tokens en las variables para que los demás requests los usen
  - Cada request tiene tests automáticos que validan status codes y estructura de respuesta
  - Para ejecutar en orden: primero correr "Login (admin)" y luego cualquier otro request

  Para importar: abrí Postman > Import > seleccioná el archivo Pymes_API.postman_collection.json.