const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const usuarios = require("../models/usuariosModel");

let refreshTokens = [];

// Protección contra intentos de login por fuerza bruta
const MAX_INTENTOS = 5;
const BLOQUEO_DURACION_MINUTOS = 1;
const intentosLogin = new Map(); // clave: usuario, valor: { intentos, bloqueadoHasta }

router.post("/api/login", async (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Login de usuarios: admin:123(rol jefe), juan:123(rol empleado). Se bloquea tras 5 intentos fallidos por 1 minuto.'

  const { usuario, clave } = req.body;

  // Verificar si el usuario está bloqueado
  const registro = intentosLogin.get(usuario);
  if (registro && registro.bloqueadoHasta) {
    const ahora = new Date();
    if (ahora < registro.bloqueadoHasta) {
      const segundosRestantes = Math.ceil((registro.bloqueadoHasta - ahora) / 1000);
      return res.status(429).json({
        message: `Usuario bloqueado por demasiados intentos fallidos. Reintente en ${segundosRestantes} segundos.`,
      });
    }
    // El bloqueo expiró, reiniciar
    intentosLogin.delete(usuario);
  }

  // Buscar usuario en la base de datos
  const user = await usuarios.findOne({ where: { Nombre: usuario } });

  if (user && await bcrypt.compare(clave, user.Clave)) {
    // Login exitoso: limpiar intentos fallidos
    intentosLogin.delete(usuario);

    // Generate an access token
    const accessToken = jwt.sign(
      { usuario: user.Nombre, rol: user.Rol },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    // Avanzado!
    const refreshToken = jwt.sign(
      { usuario: user.Nombre, rol: user.Rol },
      auth.refreshTokenSecret
    );

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken,
      message: "Bienvenido " + user.Nombre + " (rol: " + user.Rol + ")",
    });
  } else {
    // Login fallido: incrementar intentos
    const reg = intentosLogin.get(usuario) || { intentos: 0, bloqueadoHasta: null };
    reg.intentos += 1;

    if (reg.intentos >= MAX_INTENTOS) {
      reg.bloqueadoHasta = new Date(Date.now() + BLOQUEO_DURACION_MINUTOS * 60 * 1000);
      intentosLogin.set(usuario, reg);
      return res.status(429).json({
        message: `Usuario bloqueado por ${BLOQUEO_DURACION_MINUTOS} minuto(s) tras ${MAX_INTENTOS} intentos fallidos.`,
      });
    }

    intentosLogin.set(usuario, reg);
    res.status(401).json({
      message: `usuario o clave incorrecto. Intentos restantes: ${MAX_INTENTOS - reg.intentos}`,
    });
  }
});

router.post("/api/logout", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Logout: invalida el refresh token (no invalida el token actual!!!)'

  // recordar que el token sigue válido hasta que expire, aquí evitamos que pueda renovarse cuando expire!
  let message = null;
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader) {
     token = authHeader.split(" ")[1];
  }

  if (refreshTokens.includes(token)) {
    message = "Usuario deslogueado correctamente!";
  }
  else {
    message = "Logout inválido!";
  }


  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.json({ message });
});

router.post("/api/refreshtoken", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'refresh token'
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, auth.refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { usuario: user.usuario, rol: user.rol },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    res.json({
      accessToken,
    });
  });
});
module.exports = router;
