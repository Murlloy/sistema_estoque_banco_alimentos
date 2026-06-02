// routes/estoque.js
const express = require('express');
const db = require('../db');
const { autenticado } = require('../middleware/auth');
const router = express.Router();

// GET /api/estoque — listar produtos ordenados alfabeticamente
router.get('/', autenticado, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nome AS categoria_nome
       FROM produtos p
       JOIN categorias c ON p.categoria_id = c.id
       ORDER BY p.nome ASC`
    );
    // Insertion Sort aplicado sobre o array retornado (algoritmo de ordenação manual)
    const arr = [...rows];
    for (let i = 1; i < arr.length; i++) {
      const chave = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j].nome.toLowerCase() > chave.nome.toLowerCase()) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = chave;
    }
    res.json({ sucesso: true, dados: arr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar estoque.' });
  }
});

// GET /api/estoque/historico — histórico de movimentações
router.get('/historico', autenticado, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, p.nome AS produto_nome, u.nome AS usuario_nome
       FROM movimentacoes m
       JOIN produtos p ON m.produto_id = p.id
       JOIN usuarios u ON m.usuario_id = u.id
       ORDER BY m.criado_em DESC
       LIMIT 100`
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar histórico.' });
  }
});

// POST /api/estoque/movimentar — registrar entrada ou saída
router.post('/movimentar', autenticado, async (req, res) => {
  const { produto_id, tipo, quantidade, data_movimentacao, observacao } = req.body;

  if (!produto_id || !tipo || !quantidade || !data_movimentacao) {
    return res.status(400).json({ sucesso: false, mensagem: 'Produto, tipo, quantidade e data são obrigatórios.' });
  }
  if (!['entrada', 'saida'].includes(tipo)) {
    return res.status(400).json({ sucesso: false, mensagem: 'Tipo inválido.' });
  }
  if (parseFloat(quantidade) <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Quantidade deve ser maior que zero.' });
  }

  const conn = await (await require('../db')).getConnection();
  try {
    await conn.beginTransaction();

    // Buscar produto
    const [prodRows] = await conn.query('SELECT * FROM produtos WHERE id = ? FOR UPDATE', [produto_id]);
    if (prodRows.length === 0) throw new Error('Produto não encontrado.');
    const produto = prodRows[0];

    const qtd = parseFloat(quantidade);
    let novoEstoque;

    if (tipo === 'saida') {
      if (qtd > produto.estoque_atual) {
        await conn.rollback();
        return res.status(400).json({ sucesso: false, mensagem: `Estoque insuficiente. Disponível: ${produto.estoque_atual} ${produto.unidade_medida}.` });
      }
      novoEstoque = produto.estoque_atual - qtd;
    } else {
      novoEstoque = produto.estoque_atual + qtd;
    }

    // Atualizar estoque
    await conn.query('UPDATE produtos SET estoque_atual = ? WHERE id = ?', [novoEstoque, produto_id]);

    // Registrar movimentação
    await conn.query(
      `INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data_movimentacao, observacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [produto_id, req.session.usuario.id, tipo, qtd, data_movimentacao, observacao || null]
    );

    await conn.commit();

    // Verificar alerta de estoque mínimo
    let alerta = null;
    if (tipo === 'saida' && novoEstoque < produto.estoque_minimo) {
      alerta = `⚠️ ATENÇÃO: Estoque de "${produto.nome}" abaixo do mínimo! Atual: ${novoEstoque} | Mínimo: ${produto.estoque_minimo} ${produto.unidade_medida}`;
    }

    res.json({ sucesso: true, mensagem: 'Movimentação registrada com sucesso.', novoEstoque, alerta });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: err.message || 'Erro ao registrar movimentação.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
