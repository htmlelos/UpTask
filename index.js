const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

// Helpers
const helpers = require('./helpers');

// Crear la conexion a la base de datos
const db = require('./config/db');
// Importar model
require('./models/proyectos');
require('./models/tareas');

db.sync()
  .then(() => console.log('Conectado al servidor'))
  .catch((error) => console.error(error));
// Crear una app de express
const app = express();
// Archivos estaticos
app.use(express.static('public'));
// Habilitar pug
app.set('view engine', 'pug');
// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Pasar vardump a la app
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  res.locals.vardump = helpers.vardump;
  next();
});
// Habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes());

app.listen(3000);
