'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock, GraduationCap, LogOut } from 'lucide-react'
import { getAtividades } from '@/lib/api'
import type { Atividade, Bolsista } from '@/lib/types'
import { StatsCard } from './stats-card'
import { ActivityForm } from './activity-form'
import { ActivityTable } from './activity-table'

interface DashboardProps {
  bolsista: Bolsista
  onLogout: () => void
}

export function Dashboard({ bolsista, onLogout }: DashboardProps) {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [carregando, setCarregando] = useState(true)

  // Carrega o estado inicial das atividades (dados que virão do banco no futuro).
  // Observação: a chamada está isolada em lib/api.ts -> getAtividades(), que hoje
  // retorna um array simulado e futuramente fará fetch('.../api/atividades').
  useEffect(() => {
    let ativo = true
    getAtividades()
      .then((dados) => {
        if (ativo) setAtividades(dados)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  // Total de horas no mês, recalculado sempre que a lista muda.
  const totalHoras = useMemo(
    () => atividades.reduce((soma, a) => soma + a.horas, 0),
    [atividades],
  )

  function handleCreated(nova: Atividade) {
    // Atualização otimista: adiciona a nova atividade no topo da tabela.
    setAtividades((atuais) => [nova, ...atuais])
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-foreground">
                IF-Task
              </p>
              <p className="text-xs text-muted-foreground">
                Frequência e Tarefas de Bolsistas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Olá, {bolsista.nome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Matrícula {bolsista.matricula} &middot; Acompanhe suas horas e registre suas atividades.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            titulo="Total de Horas no Mês"
            valor={carregando ? '—' : `${totalHoras}h`}
            descricao="Somatório das atividades registradas"
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ActivityForm onCreated={handleCreated} />
          </div>
          <div className="lg:col-span-2">
            <ActivityTable atividades={atividades} carregando={carregando} />
          </div>
        </div>
      </main>
    </div>
  )
}
