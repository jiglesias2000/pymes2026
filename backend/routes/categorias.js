const express = require('express');
const router = express.Router();
const categorias = require('../models/categoriasModel');


// Obtener todas las categorías
router.get('/api/categorias', async (req, res) => {
  try {
    const categoriass = await categorias.findAll();
    res.json(categoriass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Obtener una categoría por ID
router.get('/api/categorias/:id', async (req, res) => {
  try {
    const datos = await categorias.findByPk(req.params.id);
    if (!datos) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});


module.exports = router;