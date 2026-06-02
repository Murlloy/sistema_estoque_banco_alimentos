// routes/produtos.js
const express = require('express');
const db = require('../db');
const { autenticado } = require('../middleware/auth');
const router = express.Router();

// GET /api/produtos — listar com busca opcional
router.get('/', autenticado, async (req, res) => {
  const busca = req.query.busca ? `%${req.query.busca}%` : '%';
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nome AS categoria_nome
       FROM produtos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.nome LIKE ? OR c.nome LIKE ?
       ORDER BY p.nome ASC`,
      [busca, busca]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar produtos.' });
  }
});

// GET /api/produtos/:id — buscar um produto
router.get('/:id', autenticado, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nome AS categoria_nome
       FROM produtos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
    res.json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar produto.' });
  }
});

// POST /api/produtos — criar
router.post('/', autenticado, async (req, res) => {
  const { nome, categoria_id, unidade_medida, peso_volume, data_validade, condicao_armazenamento, estoque_atual, estoque_minimo } = req.body;

  if (!nome || !categoria_id || !unidade_medida) {
    return res.status(400).json({ sucesso: false, mensagem: 'Nome, categoria e unidade de medida são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO produtos (nome, categoria_id, unidade_medida, peso_volume, data_validade, condicao_armazenamento, estoque_atual, estoque_minimo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, categoria_id, unidade_medida, peso_volume || null, data_validade || null, condicao_armazenamento || null, estoque_atual || 0, estoque_minimo || 0]
    );
    res.json({ sucesso: true, id: result.insertId, mensagem: 'Produto cadastrado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar produto.' });
  }
});

// PUT /api/produtos/:id — editar
router.put('/:id', autenticado, async (req, res) => {
  const { nome, categoria_id, unidade_medida, peso_volume, data_validade, condicao_armazenamento, estoque_atual, estoque_minimo } = req.body;

  if (!nome || !categoria_id || !unidade_medida) {
    return res.status(400).json({ sucesso: false, mensagem: 'Nome, categoria e unidade de medida são obrigatórios.' });
  }

  try {
    await db.query(
      `UPDATE produtos SET nome=?, categoria_id=?, unidade_medida=?, peso_volume=?, data_validade=?, condicao_armazenamento=?, estoque_atual=?, estoque_minimo=?
       WHERE id=?`,
      [nome, categoria_id, unidade_medida, peso_volume || null, data_validade || null, condicao_armazenamento || null, estoque_atual, estoque_minimo, req.params.id]
    );
    res.json({ sucesso: true, mensagem: 'Produto atualizado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar produto.' });
  }
});

// DELETE /api/produtos/:id — excluir
router.delete('/:id', autenticado, async (req, res) => {
  try {
    await db.query('DELETE FROM produtos WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Produto excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir produto. Verifique se há movimentações vinculadas.' });
  }
});

module.exports = router;
