//
const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');

exports.proyectosHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render('index', {
    nombrePagina: 'Proyectos ',
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render('nuevoProyecto', { nombrePagina: 'Nuevo Proyecto', proyectos });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  // Validar que el input es válido
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: 'Agrega un Nombre al proyecto' });
  }

  // Si hay errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos,
    });
  } else {
    // Insertar en la base de datos

    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre, usuarioId });
    res.redirect('/');
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  // Consultar tareas del proyecto actual
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    // include: [{ model: Proyectos }],
  });

  if (!proyecto) return next();

  // Renderizar proyecto
  res.render('tareas', {
    nombrePagina: 'Tareas del proyecto',
    proyecto,
    proyectos,
    tareas,
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  const proyectoPromise = Proyectos.findOne({
    where: { id: req.params.id, usuarioId },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  // Render de la vista
  res.render('nuevoProyecto', {
    nombrePagina: 'Editar Proyecto',
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  // Validar que el input es válido
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: 'Agrega un Nombre al proyecto' });
  }

  // Si hay errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos,
    });
  } else {
    // Insertar en la base de datos

    await Proyectos.update({ nombre }, { where: { id: req.params.id } });
    res.redirect('/');
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  // console.log(req);
  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

  if (!resultado) {
    return next();
  }

  res.status(200).send('Proyecto Eliminado Correctamente');
};
