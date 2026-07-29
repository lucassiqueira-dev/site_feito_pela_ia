import type { Atividade, Credenciais, NovaAtividade, Bolsista } from './types'

/**
 * ============================================================================
 * CAMADA DE INTEGRAÇÃO COM O BACKEND (IF-Task) Conectado na Porta 3001
 * ============================================================================
 */

// Mudamos a porta padrão de 3000 para 3001 para bater com o seu servidor Express
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:3001/api'

/**
 * Autentica o bolsista no servidor Express.
 *
 * @param credenciais Matrícula e senha informadas na tela de login.
 */
export async function login(credenciais: Credenciais): Promise<Bolsista> {
  if (!credenciais.matricula || !credenciais.senha) {
    throw new Error('Informe matrícula e senha.')
  }

  // Faz a requisição POST real para o backend na porta 3001
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciais),
  })

  const data = await res.json()

  if (!res.ok) {
    // Exibe a mensagem exata de erro configurada no Express ("Matrícula ou senha incorretas")
    throw new Error(data.erro || 'Matrícula ou senha inválidos.')
  }

  // Retorna os dados do bolsista para o Next.js
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
 *
 * @param atividade Dados do formulário "Registrar Nova Atividade".
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

  // Retorna a atividade criada (já contendo o ID gerado pelo backend)
  return data.atividade as Atividade
}