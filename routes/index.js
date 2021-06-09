const express = require('express');
const router = express.Router();

// Importar express Validator
const { body } = require('express-validator');

// Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function () {
  // Ruta para el home
  //GET
  router.get(
    '/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );
  router.get(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );
  // POST
  router.post(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  // Listar Proyecto
  router.get(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );

  // Actualizar el proyecto
  router.get(
    '/proyecto/editar/:id',
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );

  router.post(
    '/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );

  // Eliminar Proyecto
  router.delete(
    '/proyecto/:url',
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );

  // Crear una tarea
  router.post(
    '/proyecto/:url',
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );

  // Actualizar tarea
  router.patch(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  // Eliminar tarea
  router.delete(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // Crear nueva cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearCuenta);
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  // Iniciar sesion
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  // Cerrar sesion
  router.get('/cerrar-sesion', authController.cerrarSesion);

  // Reestablecer contraseña
  router.get('/reestablecer', usuariosController.formRestablecerPassword);
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.actualizarPassword);

  return router;
};
