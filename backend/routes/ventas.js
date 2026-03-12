const express = require("express");
const router = express.Router();
const ventascabecera = require('../models/ventasCabeceraModel');
const ventasdetalle = require('../models/ventasDetalleModel');
const clientes = require('../models/clientesModel');
const articulos = require('../models/articulosModel');
const sequelize = require('../models/configurarSequelize');
const { Op, ValidationError } = require("sequelize");


// Consultar ventas con filtros
router.get("/api/ventas", async function (req, res, next) {
  try {
    let where = {};
    if (req.query.IdCliente) {
      where.IdCliente = req.query.IdCliente;
    }
    if (req.query.FechaDesde && req.query.FechaHasta) {
      where.Fecha = {
        [Op.between]: [req.query.FechaDesde, req.query.FechaHasta],
      };
    } else if (req.query.FechaDesde) {
      where.Fecha = {
        [Op.gte]: req.query.FechaDesde,
      };
    } else if (req.query.FechaHasta) {
      where.Fecha = {
        [Op.lte]: req.query.FechaHasta,
      };
    }

    const ventas = await ventascabecera.findAll({
      attributes: ["IdVenta", "IdCliente", "Fecha", "Total"],
      where,
      order: [["Fecha", "DESC"]],
    });

    // agregar nombre del cliente a cada venta
    const clienteIds = [...new Set(ventas.map(v => v.IdCliente))];
    const clientesData = await clientes.findAll({
      attributes: ["IdCliente", "Nombre"],
      where: { IdCliente: { [Op.in]: clienteIds } },
    });
    const clientesMap = {};
    clientesData.forEach(c => { clientesMap[c.IdCliente] = c.Nombre; });

    const result = ventas.map(v => ({
      IdVenta: v.IdVenta,
      IdCliente: v.IdCliente,
      ClienteNombre: clientesMap[v.IdCliente] || '',
      Fecha: v.Fecha,
      Total: v.Total,
    }));

    return res.json(result);
  } catch (err) {
    next(err);
  }
});


// Obtener detalle de una venta
router.get("/api/ventasdetalles/:idVenta", async function (req, res, next) {
  try {
    const detalles = await ventasdetalle.findAll({
      attributes: ["IdVentaDetalle", "IdVenta", "IdArticulo", "Cantidad", "Precio"],
      where: { IdVenta: req.params.idVenta },
    });

    // agregar nombre del artículo
    const articuloIds = [...new Set(detalles.map(d => d.IdArticulo))];
    const articulosData = await articulos.findAll({
      attributes: ["IdArticulo", "Nombre"],
      where: { IdArticulo: { [Op.in]: articuloIds } },
    });
    const articulosMap = {};
    articulosData.forEach(a => { articulosMap[a.IdArticulo] = a.Nombre; });

    const result = detalles.map(d => ({
      IdVentaDetalle: d.IdVentaDetalle,
      IdVenta: d.IdVenta,
      IdArticulo: d.IdArticulo,
      ArticuloNombre: articulosMap[d.IdArticulo] || '',
      Cantidad: d.Cantidad,
      Precio: d.Precio,
    }));

    return res.json(result);
  } catch (err) {
    next(err);
  }
});


// Grabar nueva venta (cabecera + detalles)
router.post("/api/ventas", async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { Venta, VentasDetalle } = req.body;

    if (!Venta || !VentasDetalle || VentasDetalle.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Datos de venta incompletos" });
    }

    // crear cabecera
    const cabecera = await ventascabecera.create(
      {
        IdCliente: Venta.IdCliente,
        Fecha: Venta.Fecha,
        Total: Venta.Total,
      },
      { transaction: t }
    );

    // crear detalles
    for (const detalle of VentasDetalle) {
      await ventasdetalle.create(
        {
          IdVenta: cabecera.IdVenta,
          IdArticulo: detalle.IdArticulo,
          Cantidad: detalle.Cantidad,
          Precio: detalle.Precio,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ IdVenta: cabecera.IdVenta });
  } catch (err) {
    await t.rollback();
    if (err instanceof ValidationError) {
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({ message: messages });
    } else {
      next(err);
    }
  }
});


module.exports = router;
