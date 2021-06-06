const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res) => {
  // OBtenemos el proyecto actual
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
  // Leer valor del input del formulario
  const { tarea } = req.body;
  // Estado 0 = incompleto y ID del proyecto
  const estado = 0;
  console.log('proyecto->', proyecto.id);
  const ProyectoId = proyecto.id;

  // Insertar en la base de datos
  const resultado = await Tareas.create({ tarea, estado, ProyectoId });

  if (!resultado) {
    return next();
  }
  // redireccionar
  res.redirect(`/proyectos/${req.params.url}`);
};
