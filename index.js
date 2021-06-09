const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importar variables de ambiente
require('dotenv').config({ path: 'variables.env' });

// Helpers
const helpers = require('./helpers');

// Crear la conexion a la base de datos
const db = require('./config/db');
// Importar model
require('./models/usuarios');
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

// Habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Las sessiones nos permiten navegar entre distintas paginas sin volver a autenticar
app.use(
  session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump a la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  next();
});

app.use('/', routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => console.log('El servidor esta ejecutandose...'));
