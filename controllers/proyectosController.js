const Proyectos = require('../models/proyectos');

exports.proyectosHome = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render('index', {
    nombrePagina: 'Proyectos ' + res.locals.year,
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render('nuevoProyecto', { nombrePagina: 'Nuevo Proyecto', proyectos });
};

exports.nuevoProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll();
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

    const proyecto = await Proyectos.create({ nombre });
    res.redirect('/');
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const proyectos = await Proyectos.findAll();

  const proyecto = await Proyectos.findOne({
    where: {
      url: req.params.url,
    },
  });

  if (!proyecto) return next();

  // Renderizar proyecto
  res.render('tareas', {
    nombrePagina: 'Tareas del proyecto',
    proyecto,
    proyectos,
  });
};
