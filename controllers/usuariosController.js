const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', { nombrePagina: 'Crear Cuenta en UpTask' });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar una sesión en UpTask',
    error,
  });
};

exports.crearCuenta = async (req, res) => {
  // leer los datos
  const { email, password } = req.body;

  try {
    // crear el usuario
    await Usuarios.create({ email, password });

    // Crear una url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // crear el objeto de usuario
    const usuario = { email };
    // Enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmarUrl,
      archivo: 'confirmar-cuenta',
    });

    // redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    console.log('ÉRROR==>', error);
    req.flash(
      'error',
      error.errors.map((error) => error.message)
    );
    res.render('crearCuenta', {
      mensajes: req.flash(),
      nombrePagina: 'Crear Cuenta en UpTask',
      email,
      password,
    });
  }
};

exports.formRestablecerPassword = async (req, res) => {
  res.render('reestablecer', { nombrePagina: 'Reestablecer tu contraseña' });
};

// Cambia el estado de la cuenta a activo
exports.confirmarCuenta = async (req, res) => {
  const { correo } = req.params;
  const usuario = await Usuarios.findOne({ where: { email: correo } });

  // si no existe el usuario

  if (!usuario) {
    req.flash('error', 'No válido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada correctamente');
  res.redirect('/iniciar-sesion');
};
