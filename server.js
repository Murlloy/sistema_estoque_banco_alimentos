// server.js — Servidor principal
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const estoqueRoutes = require('./routes/estoque');
const categoriasRoutes = require('./routes/categorias');
const usuarioRoutes = require('./routes/usuario');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'sistema/public')));

app.use(session({
  secret: 'estoque_banco_alimentos_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

// Rotas
app.use('/', authRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/usuario', usuarioRoutes);

// Rota raiz — redireciona para login ou dashboard
app.get('/', (req, res) => {
  if (req.session && req.session.usuario) {
    return res.sendFile(path.join(__dirname, 'sistema/public/pages/dashboard.html'));
  }
  res.redirect('/login');
});

app.get('/cadastro', (req, res) => {
  if (!req.session || !req.session.usuario) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'sistema/public/pages/cadastro.html'));
});

app.get('/estoque', (req, res) => {
  if (!req.session || !req.session.usuario) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'sistema/public/pages/estoque.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Login: admin@estoque.com | Senha: admin123\n`);
});
