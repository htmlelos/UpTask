const express = require('express');
const router = express.Router();

// Importar express Validator
const { body } = require('express-validator');

// Importar el controlador
const proyectosController = require('../controllers/proyectosController');

module.exports = function () {
  // Ruta para el home
  //GET
  router.get('/', proyectosController.proyectosHome);
  router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
  // POST
  router.post(
    '/nuevo-proyecto',
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  // Listar Proyecto
  router.get('/proyectos/:url', proyectosController.proyectoPorUrl);
  return router;
};
