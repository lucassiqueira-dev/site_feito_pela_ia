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
const USUARIOS_MOCK = [
    { matricula: "123456", senha: "senha123", nome: "Bolsista Teste" }
];

const atividadesBanco = [
    { id: 1, data: "2026-07-29", descricao: "Estudo inicial das ferramentas de IA e v0.dev", horas: 4 },
    { id: 2, data: "2026-07-29", descricao: "Estruturação do servidor Express para a oficina", horas: 3 }
];

// ==========================================
// ROTAS DA API
// ==========================================

// 1. POST /api/login - Autenticação
app.post('/api/login', (req, res) => {
    const { matricula, senha } = req.body;

    if (!matricula || !senha) {
        return res.status(400).json({ erro: "Matrícula e senha são obrigatórias." });
    }

    const usuarioLogado = USUARIOS_MOCK.find(
        user => user.matricula === matricula && user.senha === senha
    );

    if (usuarioLogado) {
        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: { nome: usuarioLogado.nome, matricula: usuarioLogado.matricula }
        });
    } else {
        return res.status(401).json({ erro: "Matrícula ou senha incorretas." });
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