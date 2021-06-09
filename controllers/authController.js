const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos Campos son Obligatorios',
});

// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
  // si el usuario esta autenticado, adelante
  if (req.isAuthenticated()) return next();
  // Sino esta autenticado redirigir
  return res.redirect('/iniciar-sesion');
};

// Funcion para cerrar sesion
exports.cerrarSesion = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  });
};

// Genera un token si el usuario es válido
exports.enviarToken = async (req, res) => {
  // Verificar que el usuario existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  // Si no existe el usuarioAutenticado
  if (!usuario) {
    req.flash('error', 'No existe ese usuario');
    req.redirect('/reestablecer');
  }

  // El usuario existe
  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;

  // Guardarlos en la base de datos
  await usuario.save();

  // url de reset
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // Envia el correo con el token
  await enviarEmail.enviar({
    usuario,
    subject: 'Reseteo de contraseña',
    resetUrl,
    archivo: 'reestablecer-password',
  });

  req.flash('correcto', 'Se envió un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
  const { token } = req.params;
  console.log('TOKEN-->', token);
  const usuario = await Usuarios.findOne({ where: { token } });
  console.log('USUARIO-->', usuario);

  // si no se encuentra un usuario con el token indicado
  if (!usuario) {
    req.flash('error', 'No válido');
    res.redirect('/reestablecer');
  }

  // Formulario para generar el password
  res.render('resetPassword', { nombrePagina: 'Reestablecer Contraseña' });
};

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
  // Verifica que el token sea válido pero tambien la fecha de expiración
  const { token } = req.params;
  const usuario = await Usuarios.findOne({
    where: { token, expiracion: { [Op.gte]: Date.now() } },
  });

  // Verificamos si el usuario existe
  if (!usuario) {
    req.flash('error', 'No Válido');
    res.redirect('/reestablecer');
  }

  // Hashing del password

  const { password } = req.body;
  usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // guardamos el nuevo password
  await usuario.save();

  req.flash('correcto', 'Tu password se ha modificado correctamente');
  res.redirect('/iniciar-sesion');
};
