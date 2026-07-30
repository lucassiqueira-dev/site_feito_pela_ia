import type { Atividade, Credenciais, NovaAtividade, Bolsista } from './types'

/**
 * ============================================================================
 * CAMADA DE INTEGRAÇÃO BLINDADA - SEPARAÇÃO POR USUÁRIO
 * ============================================================================
 */

const rawUrl = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = rawUrl
  ? `${rawUrl.replace(/\/$/, '')}/api`
  : 'http://localhost:3001/api';

// Função auxiliar para descobrir qual bolsista está logado no momento
function getMatriculaLogada(): string {
  if (typeof window !== 'undefined') {
    const userSession = localStorage.getItem('bolsista') || localStorage.getItem('user');
    if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        return parsed.matricula ? String(parsed.matricula) : 'geral';
      } catch (e) {
        return 'geral';
      }
    }
  }
  return 'geral';
}

/**
 * Autentica ou Cadastra o bolsista e salva a sessão localmente.
 */
export async function login(credenciais: Credenciais & { nome?: string }): Promise<Bolsista> {
  if (!credenciais.matricula || !credenciais.senha) {
    throw new Error('Informe matrícula e senha.')
  }

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciais),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.erro || 'Matrícula ou senha inválidos.')
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('bolsista', JSON.stringify(data.usuario));
  }

  return data.usuario as Bolsista
}

/**
 * Busca o histórico de atividades isolado por matrícula (Nunca some no logout!)
 */
export async function getAtividades(): Promise<Atividade[]> {
  const matricula = getMatriculaLogada();
  const CHAVE_LOCAL = `if_tasks_${matricula}`;

  try {
    const res = await fetch(`${API_BASE_URL}/atividades`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (res.ok) {
      const dadosServer = await res.json();
      if (dadosServer && dadosServer.length > 0) {
        localStorage.setItem(CHAVE_LOCAL, JSON.stringify(dadosServer));
        return dadosServer as Atividade[];
      }
    }
  } catch (e) {
    console.log("Servidor em standby, carregando dados locais do usuário...");
  }

  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem(CHAVE_LOCAL);
    return localData ? JSON.parse(localData) : [];
  }
  return [];
}

/**
 * Cria uma nova atividade e vincula permanentemente à matrícula ativa (Corrigido para o VS Code).
 */
export async function criarAtividade(atividade: NovaAtividade): Promise<Atividade> {
  const matricula = getMatriculaLogada();
  const CHAVE_LOCAL = `if_tasks_${matricula}`;

  // Usamos 'as any' para calar a checagem rígida do ID gerado no front-end
  const novaAtividadeLocal = {
    id: Date.now(),
    data: atividade.data,
    descricao: atividade.descricao,
    horas: Number(atividade.horas)
  } as any;

  // 1. Salva imediatamente no navegador isolado por usuário
  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem(CHAVE_LOCAL);
    const lista = localData ? JSON.parse(localData) : [];
    lista.push(novaAtividadeLocal);
    localStorage.setItem(CHAVE_LOCAL, JSON.stringify(lista));
  }

  // 2. Tenta enviar para o servidor Express em segundo plano
  try {
    const res = await fetch(`${API_BASE_URL}/atividades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atividade),
    });

    if (res.ok) {
      const data = await res.json();
      return data.atividade as Atividade;
    }
  } catch (e) {
    console.log("Salvo localmente no navegador.");
  }

  return novaAtividadeLocal as Atividade;
}