import type { Atividade, Credenciais, NovaAtividade, Bolsista } from './types'

/**
 * ============================================================================
 * CAMADA DE INTEGRAÇÃO COM O BACKEND (IF-Task) Conectado na Nuvem / Local
 * ============================================================================
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:3001/api'

/**
 * Autentica ou Cadastra o bolsista no servidor Express.
 * Adicionamos o campo opcional 'nome' para o fluxo de cadastro automático.
 */
export async function login(credenciais: Credenciais & { nome?: string }): Promise<Bolsista> {
  if (!credenciais.matricula || !credenciais.senha) {
    throw new Error('Informe matrícula e senha.')
  }

  // Faz a requisição POST real enviando matrícula, senha e o nome (se houver)
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
 * Busca o histórico de atividades direto do Array na memória do servidor Node.js.
 */
export async function getAtividades(): Promise<Atividade[]> {
  const res = await fetch(`${API_BASE_URL}/atividades`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    throw new Error('Não foi possível carregar as atividades.')
  }
  
  return (await res.json()) as Atividade[]
}

/**
 * Cria uma nova atividade enviando os dados para persistência no backend.
 */
export async function criarAtividade(
  atividade: NovaAtividade,
): Promise<Atividade> {
  const res = await fetch(`${API_BASE_URL}/atividades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atividade),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.erro || 'Não foi possível salvar a atividade.')
  }

  return data.atividade as Atividade
}