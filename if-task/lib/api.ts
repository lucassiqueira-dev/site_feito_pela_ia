import type { Atividade, Credenciais, NovaAtividade, Bolsista } from './types'

/**
 * ============================================================================
 * CAMADA DE INTEGRAÇÃO COM O BACKEND (IF-Task) Conectado na Nuvem / Local
 * ============================================================================
 */

const rawUrl = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = rawUrl
  ? `${rawUrl.replace(/\/$/, '')}/api`
  : 'http://localhost:3001/api';

/**
 * Autentica ou Cadastra o bolsista no servidor Express.
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

  return data.usuario as Bolsista
}

/**
 * Busca o histórico de atividades (Tenta o servidor; se falhar ou reiniciar, usa o LocalStorage)
 */
export async function getAtividades(): Promise<Atividade[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/atividades`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (res.ok) {
      const dados = await res.json()
      // Guarda uma cópia local de segurança no navegador
      localStorage.setItem('if_tasks_backup', JSON.stringify(dados))
      return dados as Atividade[]
    }
  } catch (e) {
    console.log("Servidor instável, carregando backup local...")
  }

  // Plano B: Se o Render falhar, o app não fica em branco na apresentação!
  const localData = localStorage.getItem('if_tasks_backup')
  return localData ? JSON.parse(localData) : []
}

/**
 * Cria uma nova atividade (Envia pro servidor e atualiza o espelho local)
 */
export async function criarAtividade(
  atividade: NovaAtividade,
): Promise<Atividade> {
  const novaAtividadeLocal: Atividade = {
    id: Date.now(),
    ...atividade,
    horas: Number(atividade.horas)
  }

  try {
    const res = await fetch(`${API_BASE_URL}/atividades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atividade),
    })

    if (res.ok) {
      const data = await res.json()
      return data.atividade as Atividade
    }
  } catch (e) {
    console.log("Falha ao enviar para o servidor, salvando localmente...")
  }

  // Se o servidor cair no meio da criação, ele salva no navegador para não dar erro na tela
  const localData = localStorage.getItem('if_tasks_backup')
  const lista = localData ? JSON.parse(localData) : []
  lista.push(novaAtividadeLocal)
  localStorage.setItem('if_tasks_backup', JSON.stringify(lista))

  return novaAtividadeLocal
}