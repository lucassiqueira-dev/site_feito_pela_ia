const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; 

// Caminho do arquivo que vai funcionar como nosso Banco de Dados Real
const FILE_PATH = path.join(__dirname, 'usuarios.json');

// Função para ler os usuários salvos no arquivo
function lerUsuarios() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      const padrao = [{ matricula: "123456", senha: "senha123", nome: "Bolsista Teste" }];
      fs.writeFileSync(FILE_PATH, JSON.stringify(padrao, null, 2));
      return padrao;
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [{ matricula: "123456", senha: "senha123", nome: "Bolsista Teste" }];
  }
}

// Função para salvar novos usuários no arquivo
function salvarUsuarios(lista) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(lista, null, 2));
}

// Middlewares obrigatórios
app.use(cors()); 
app.use(express.json()); 

// Alterado para let para permitir manipulação estável nas rotas
let atividadesBanco = [];

// ==========================================
// ROTAS DA API
// ==========================================

// 1. POST /api/login - Autenticação e Cadastro Automático Protegido
app.post('/api/login', (req, res) => {
  try {
    const { matricula, senha, nome } = req.body; 

    if (!matricula || !senha) {
      return res.status(400).json({ erro: 'Matrícula e senha são obrigatórias.' });
    }

    let usuarios = lerUsuarios();

    const usuarioExistente = usuarios.find(u => String(u.matricula) === String(matricula));

    if (usuarioExistente) {
      if (usuarioExistente.senha === senha) {
        return res.json({ usuario: { matricula: usuarioExistente.matricula, nome: usuarioExistente.nome } });
      } else {
        return res.status(401).json({ erro: 'Senha incorreta para esta matrícula.' });
      }
    } else {
      const nomeFinal = nome && nome.trim() !== "" ? nome : `Bolsista (${matricula})`;

      const novoUsuario = {
        matricula: String(matricula),
        senha: String(senha),
        nome: nomeFinal
      };

      usuarios.push(novoUsuario);
      salvarUsuarios(usuarios); 

      return res.json({ usuario: { matricula: novoUsuario.matricula, nome: novoUsuario.nome } });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

// 2. GET /api/atividades - Listar tarefas
app.get('/api/atividades', (req, res) => {
    try {
        return res.status(200).json(atividadesBanco || []);
    } catch (error) {
        return res.status(200).json([]);
    }
});

// 3. POST /api/atividades - Criar nova tarefa com tratamento de erros
app.post('/api/atividades', (req, res) => {
    try {
        const { data, descricao, horas } = req.body;

        if (!data || !descricao || !horas) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        const novaAtividade = {
            id: (atividadesBanco.length || 0) + 1,
            data,
            descricao,
            horas: Number(horas)
        };

        if (!atividadesBanco) activitiesBanco = [];
        atividadesBanco.push(novaAtividade);
        
        return res.status(201).json({
            mensagem: "Atividade registrada com sucesso!",
            atividade: novaAtividade
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro interno ao salvar atividade." });
    }
});

// Inicialização
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});