# 🌾 Sistema de Controle de Estoque — Banco de Alimentos

Sistema web para gerenciamento de estoque de um banco de alimentos,
com autenticação de usuários, cadastro de produtos e gestão de movimentações.

---

## 📋 Pré-requisitos

- Node.js (v18+)
- MySQL (v8+) ou MariaDB
- npm

---

## 🚀 Instalação e execução

### 1. Criar e popular o banco de dados

No MySQL, execute o script SQL:

```bash
mysql -u root -p < estoque_db.sql
```

Ou abra o arquivo `estoque_db.sql` no MySQL Workbench e execute.

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar conexão com o banco (opcional)

Por padrão, a conexão usa:
- Host: `localhost`
- Usuário: `root`
- Senha: *(vazia)*
- Banco: `estoque_db`

Para alterar, edite o arquivo `db.js` ou defina variáveis de ambiente:

```bash
DB_HOST=localhost DB_USER=root DB_PASS=suasenha DB_NAME=estoque_db npm run dev
```

### 4. Iniciar o servidor

**Desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

Acesse: **http://localhost:3000**

---

## 🔑 Usuários de acesso (demo)

| E-mail | Senha |
|--------|-------|
| admin@estoque.com | admin123 |
| fulano@estoque.com | admin123 |
| ciclana@estoque.com | admin123 |

> As senhas no banco estão criptografadas com bcrypt.

---

## 📁 Estrutura do projeto

```
estoque/
├── server.js              # Servidor Express principal
├── db.js                  # Conexão com MySQL
├── package.json
├── estoque_db.sql         # Script do banco de dados
├── middleware/
│   └── auth.js            # Proteção de rotas
├── routes/
│   ├── auth.js            # Login / Logout
│   ├── produtos.js        # CRUD de produtos
│   ├── estoque.js         # Movimentações de estoque
│   ├── categorias.js      # Listagem de categorias
│   └── usuario.js         # Dados do usuário logado
└── sistema/public/
    ├── css/style.css      # Estilos globais
    └── pages/
        ├── login.html     # Tela de autenticação
        ├── dashboard.html # Tela principal
        ├── cadastro.html  # Cadastro de produtos
        └── estoque.html   # Gestão de estoque
```

---

## ✅ Funcionalidades

- **Autenticação** com sessão e bcrypt
- **Cadastro de Produtos**: criar, editar, excluir, buscar
- **Gestão de Estoque**: entrada/saída, ordenação alfabética (Insertion Sort)
- **Alertas automáticos** de estoque abaixo do mínimo
- **Histórico completo** de movimentações com responsável e data
- **Dashboard** com indicadores e alertas gerais

---

## 🛠️ Tecnologias

| Tecnologia | Versão |
|-----------|--------|
| Node.js | 18+ |
| Express | 4.x |
| MySQL2 | 3.x |
| bcrypt | 5.x |
| express-session | 1.x |
| nodemon (dev) | 3.x |
| MySQL / MariaDB | 8.x |
