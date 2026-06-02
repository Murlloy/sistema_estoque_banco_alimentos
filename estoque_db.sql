-- ============================================================
-- BANCO DE DADOS: estoque_db
-- Sistema de Controle de Estoque - Banco de Alimentos
-- ============================================================

CREATE DATABASE IF NOT EXISTS estoque_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE estoque_db;

-- ------------------------------------------------------------
-- TABELA: usuarios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABELA: categorias
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- TABELA: produtos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria_id INT NOT NULL,
    unidade_medida VARCHAR(30) NOT NULL,
    peso_volume DECIMAL(10,3),
    data_validade DATE,
    condicao_armazenamento VARCHAR(100),
    estoque_atual DECIMAL(10,3) DEFAULT 0,
    estoque_minimo DECIMAL(10,3) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ------------------------------------------------------------
-- TABELA: movimentacoes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    data_movimentacao DATE NOT NULL,
    observacao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ============================================================
-- POPULAÇÃO DAS TABELAS
-- ============================================================

-- Usuários (senhas: admin123, fulano123, ciclano123)
-- Senha de todos os usuários: admin123
INSERT INTO usuarios (nome, email, senha) VALUES
('Administrador', 'admin@estoque.com', '$2b$10$CZqUsg7uQYQjEJGRIkMdu.RXShsMsMCvV79yMVxRZ.nyhbQ8RL9nq'),
('Fulano Silva', 'fulano@estoque.com', '$2b$10$CZqUsg7uQYQjEJGRIkMdu.RXShsMsMCvV79yMVxRZ.nyhbQ8RL9nq'),
('Ciclana Souza', 'ciclana@estoque.com', '$2b$10$CZqUsg7uQYQjEJGRIkMdu.RXShsMsMCvV79yMVxRZ.nyhbQ8RL9nq');

-- Categorias
INSERT INTO categorias (nome) VALUES
('Alimento Não Perecível'),
('Alimento Perecível'),
('Higiene Pessoal'),
('Limpeza');

-- Produtos
INSERT INTO produtos (nome, categoria_id, unidade_medida, peso_volume, data_validade, condicao_armazenamento, estoque_atual, estoque_minimo) VALUES
('Arroz Branco', 1, 'kg', 5.000, '2026-12-31', 'Local seco e arejado', 120.000, 30.000),
('Feijão Carioca', 1, 'kg', 1.000, '2026-10-15', 'Local seco e arejado', 85.000, 20.000),
('Macarrão Espaguete', 1, 'pacote', 0.500, '2026-08-20', 'Local seco', 60.000, 15.000),
('Óleo de Soja', 1, 'litro', 0.900, '2026-07-01', 'Local seco e escuro', 40.000, 10.000),
('Leite Integral UHT', 1, 'litro', 1.000, '2026-04-30', 'Local seco', 200.000, 50.000),
('Pão de Forma Integral', 2, 'unidade', 0.500, '2026-06-10', 'Refrigerado', 15.000, 5.000),
('Banana Prata', 2, 'kg', 1.000, '2026-06-05', 'Temperatura ambiente', 30.000, 10.000),
('Sabonete', 3, 'unidade', 0.090, '2028-01-01', 'Local seco', 50.000, 20.000),
('Shampoo 200ml', 3, 'unidade', 0.200, '2027-06-01', 'Local seco', 25.000, 8.000),
('Detergente 500ml', 4, 'unidade', 0.500, '2027-12-01', 'Local seco', 35.000, 10.000),
('Água Sanitária 1L', 4, 'unidade', 1.000, '2026-09-01', 'Local fresco e ventilado', 20.000, 8.000),
('Sabão em Pó 1kg', 4, 'kg', 1.000, '2027-03-01', 'Local seco', 18.000, 5.000);

-- Movimentações
INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data_movimentacao, observacao) VALUES
(1, 1, 'entrada', 50.000, '2026-05-01', 'Doação Supermercado ABC'),
(1, 2, 'saida', 10.000, '2026-05-10', 'Distribuição família 001 a 010'),
(2, 1, 'entrada', 30.000, '2026-05-02', 'Doação empresa XYZ'),
(2, 3, 'saida', 5.000, '2026-05-12', 'Distribuição cesta básica'),
(3, 1, 'entrada', 20.000, '2026-05-03', 'Campanha de arrecadação'),
(5, 2, 'entrada', 100.000, '2026-05-05', 'Doação prefeitura'),
(5, 2, 'saida', 30.000, '2026-05-15', 'Distribuição mensal'),
(8, 1, 'entrada', 30.000, '2026-05-04', 'Doação Farmácia Popular'),
(10, 3, 'entrada', 15.000, '2026-05-06', 'Doação empresa limpeza'),
(6, 1, 'saida', 5.000, '2026-05-20', 'Distribuição urgente');
