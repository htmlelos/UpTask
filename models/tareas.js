const Sequelize = require('sequelize');
const db = require('../config/db');
const proyectos = require('./proyectos');

const Tareas = db.define('tareas', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  tarea: Sequelize.STRING(100),
  estado: Sequelize.INTEGER(1),
});

Tareas.belongsTo(proyectos);

module.exports = Tareas;
