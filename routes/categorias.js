// routes/categorias.js
const express = require('express');
const db = require('../db');
const { autenticado } = require('../middleware/auth');
const router = express.Router();

router.get('/', autenticado, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias ORDER BY nome ASC');
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar categorias.' });
  }
});

module.exports = router;
