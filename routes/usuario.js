// routes/usuario.js
const express = require('express');
const { autenticado } = require('../middleware/auth');
const router = express.Router();

router.get('/me', autenticado, (req, res) => {
  res.json({ sucesso: true, usuario: req.session.usuario });
});

module.exports = router;
