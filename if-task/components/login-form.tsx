'use client'

import { useState } from 'react'
import { GraduationCap, Loader2, Lock, User, SquareUser } from 'lucide-react'
import { login } from '@/lib/api'
import type { Bolsista } from '@/lib/types'

interface LoginFormProps {
  onLogin: (bolsista: Bolsista) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isCadastro, setIsCadastro] = useState(false) // Controla se exibe login ou cadastro
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('') // Novo estado para o nome do bolsista
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      // Passamos a matrícula, senha e o nome (caso o modo seja cadastro)
      const bolsista = await login({ 
        matricula, 
        senha, 
        ...(isCadastro && { nome: nome.trim() }) 
      })
      onLogin(bolsista)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao processar requisição.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            IF-Task
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Controle de Frequência e Tarefas de Bolsistas
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
          <h2 className="text-lg font-semibold text-card-foreground">
            {isCadastro ? 'Criar sua conta' : 'Acessar sua conta'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isCadastro 
              ? 'Preencha os campos para se registrar no sistema.' 
              : 'Entre com sua matrícula e senha institucional.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            
            {/* CAMPO DINÂMICO DE NOME COMPLETO (SÓ APARECE NO MODO CADASTRO) */}
            {isCadastro && (
              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <label
                  htmlFor="nome"
                  className="text-sm font-medium text-foreground"
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <SquareUser
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required={isCadastro}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="matricula"
                className="text-sm font-medium text-foreground"
              >
                Matrícula
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="matricula"
                  name="matricula"
                  type="text"
                  autoComplete="username"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Ex.: 20231234567"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="senha"
                className="text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            {erro ? (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {erro}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isCadastro ? 'Cadastrando...' : 'Entrando...'}
                </>
              ) : (
                isCadastro ? 'Cadastrar e Entrar' : 'Entrar'
              )}
            </button>
            
            {/* BOTÃO PARA ALTERNAR ENTRE LOGIN E CADASTRO */}
            <button
              type="button"
              onClick={() => {
                setIsCadastro(!isCadastro)
                setErro(null)
              }}
              className="mt-1 text-sm text-primary hover:underline bg-transparent border-none outline-none cursor-pointer text-center"
            >
              {isCadastro ? 'Já tem uma conta? Entre aqui' : 'Ainda não tem uma conta? Cadastre-se'}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Instituto Federal &middot; Programa de Bolsas
        </p>
      </div>
    </main>
  )
}