// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  if (req.session && req.session.usuario) return res.redirect('/');
  res.sendFile('login.html', { root: './sistema/public/pages' });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.json({ sucesso: false, mensagem: 'Preencha e-mail e senha.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.json({ sucesso: false, mensagem: 'E-mail não encontrado.' });
    }

    const usuario = rows[0];
    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.json({ sucesso: false, mensagem: 'Senha incorreta.' });
    }

    req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
    res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.json({ sucesso: false, mensagem: 'Erro interno. Tente novamente.' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
