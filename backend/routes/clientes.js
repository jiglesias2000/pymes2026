const express = require("express");
const router = express.Router();
const clientes = require('../models/clientesModel');
const { Op, ValidationError } = require("sequelize");


// Typeahead (sin bloqueo de pantalla)
router.get("/api/clientes/typeahead", async function (req, res, next) {
  try {
    let where = {};
    if (req.query.Nombre != undefined && req.query.Nombre !== "") {
      where.Nombre = {
        [Op.like]: "%" + req.query.Nombre + "%",
      };
    }
    const data = await clientes.findAll({
      attributes: ["IdCliente", "Nombre"],
      where,
      order: [["Nombre", "ASC"]],
      limit: 10,
    });
    return res.json(data);
  } catch (err) {
    next(err);
  }
});


// Listado paginado con filtros
router.get("/api/clientes", async function (req, res, next) {
  try {
    let where = {};
    if (req.query.Nombre != undefined && req.query.Nombre !== "") {
      where.Nombre = {
        [Op.like]: "%" + req.query.Nombre + "%",
      };
    }
    if (req.query.Activo != undefined && req.query.Activo !== "") {
      where.Activo = req.query.Activo === "true";
    }
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows } = await clientes.findAndCountAll({
      attributes: [
        "IdCliente",
        "Nombre",
        "Cuit",
        "CreditoMaximo",
        "FechaIngreso",
        "Activo",
      ],
      where,
      offset: (Pagina - 1) * TamañoPagina,
      limit: TamañoPagina,
    });

    return res.json({ Items: rows, RegistrosTotal: count });
  } catch (err) {
    next(err);
  }
});


// Obtener por Id
router.get("/api/clientes/:id", async function (req, res, next) {
  try {
    let item = await clientes.findOne({
      attributes: [
        "IdCliente",
        "Nombre",
        "Cuit",
        "Mail",
        "CreditoMaximo",
        "FechaNacimiento",
        "FechaIngreso",
        "Localidad",
        "Calle",
        "NumeroCalle",
        "Activo",
      ],
      where: { IdCliente: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});


// Crear
router.post("/api/clientes/", async (req, res, next) => {
  try {
    let item = await clientes.create({
      Nombre: req.body.Nombre,
      Cuit: req.body.Cuit,
      Mail: req.body.Mail,
      CreditoMaximo: req.body.CreditoMaximo,
      FechaNacimiento: req.body.FechaNacimiento,
      FechaIngreso: req.body.FechaIngreso,
      Localidad: req.body.Localidad,
      Calle: req.body.Calle,
      NumeroCalle: req.body.NumeroCalle,
      Activo: req.body.Activo,
    });
    res.status(201).json(item.dataValues);
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({ message: messages });
    } else {
      next(err);
    }
  }
});


// Modificar
router.put("/api/clientes/:id", async (req, res, next) => {
  try {
    let item = await clientes.findOne({
      where: { IdCliente: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    item.Nombre = req.body.Nombre;
    item.Cuit = req.body.Cuit;
    item.Mail = req.body.Mail;
    item.CreditoMaximo = req.body.CreditoMaximo;
    item.FechaNacimiento = req.body.FechaNacimiento;
    item.FechaIngreso = req.body.FechaIngreso;
    item.Localidad = req.body.Localidad;
    item.Calle = req.body.Calle;
    item.NumeroCalle = req.body.NumeroCalle;
    item.Activo = req.body.Activo;
    await item.save();
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({ message: messages });
    } else {
      next(err);
    }
  }
});


// Baja lógica (toggle Activo)
router.delete("/api/clientes/:id", async (req, res, next) => {
  try {
    let data = await clientes.sequelize.query(
      "UPDATE clientes SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdCliente = :IdCliente",
      {
        replacements: { IdCliente: +req.params.id },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    if (err instanceof ValidationError) {
      const messages = err.errors.map((x) => x.message);
      res.status(400).json(messages);
    } else {
      next(err);
    }
  }
});


module.exports = router;
