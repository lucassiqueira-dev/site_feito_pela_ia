const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Porta diferente do Next.js (que usa a 3000)

// Middlewares obrigatórios
app.use(cors()); // Permite a comunicação entre portas diferentes (3000 -> 3001)
app.use(express.json()); // Permite que o servidor entenda JSON enviado no corpo das requisições

// ==========================================
// SIMULAÇÃO DO BANCO DE DADOS (Em Memória)
// ==========================================
// Mudamos para 'usuarios' para bater com o que a rota está usando
let usuarios = [
    { matricula: "123456", senha: "senha123", nome: "Bolsista Teste" }
];

const atividadesBanco = [];

// ==========================================
// ROTAS DA API
// ==========================================

// 1. POST /api/login - Autenticação e Cadastro Automático
app.post('/api/login', (req, res) => {
  try {
    const { matricula, senha, nome } = req.body; // Agora recebe o nome também

    if (!matricula || !senha) {
      return res.status(400).json({ erro: 'Matrícula e senha são obrigatórias.' });
    }

    const usuarioExistente = usuarios.find(u => String(u.matricula) === String(matricula));

    if (usuarioExistente) {
      if (usuarioExistente.senha === senha) {
        return res.json({ usuario: { matricula: usuarioExistente.matricula, nome: usuarioExistente.nome } });
      } else {
        return res.status(401).json({ erro: 'Senha incorreta para esta matrícula.' });
      }
    } else {
      // SE NÃO EXISTE: Usa o nome digitado, ou um padrão caso tenham deixado em branco
      const nomeFinal = nome && nome.trim() !== "" ? nome : `Bolsista (${matricula})`;

      const novoUsuario = {
        matricula: String(matricula),
        senha: String(senha),
        nome: nomeFinal
      };

      usuarios.push(novoUsuario);
      return res.json({ usuario: { matricula: novoUsuario.matricula, nome: novoUsuario.nome } });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

// 2. GET /api/atividades - Listar tarefas
app.get('/api/atividades', (req, res) => {
    return res.status(200).json(atividadesBanco);
});

// 3. POST /api/atividades - Criar nova tarefa
app.post('/api/atividades', (req, res) => {
    const { data, descricao, horas } = req.body;

    if (!data || !descricao || !horas) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    const novaAtividade = {
        id: atividadesBanco.length + 1,
        data,
        descricao,
        horas: Number(horas)
    };

    atividadesBanco.push(novaAtividade);
    return res.status(201).json({
        mensagem: "Atividade registrada com sucesso!",
        atividade: novaAtividade
    });
});

// Inicialização
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});