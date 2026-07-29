'use client'

import { useState } from 'react'
import { Loader2, PlusCircle } from 'lucide-react'
import { criarAtividade } from '@/lib/api'
import type { Atividade } from '@/lib/types'

interface ActivityFormProps {
  /** Chamado após a atividade ser criada com sucesso (para atualizar a tabela). */
  onCreated: (atividade: Atividade) => void
}

export function ActivityForm({ onCreated }: ActivityFormProps) {
  const [data, setData] = useState('')
  const [descricao, setDescricao] = useState('')
  const [horas, setHoras] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro(null)

    const horasNum = Number(horas)
    if (!data || !descricao.trim() || !horas || horasNum <= 0) {
      setErro('Preencha todos os campos com valores válidos.')
      return
    }

    setEnviando(true)
    try {
      // A chamada de API está encapsulada em lib/api.ts -> criarAtividade().
      // É lá que a requisição fetch('http://localhost:3000/api/atividades', { method: 'POST', ... })
      // será inserida para salvar os dados no banco através do backend.
      const nova = await criarAtividade({
        data,
        descricao: descricao.trim(),
        horas: horasNum,
      })
      onCreated(nova)
      // Limpa o formulário após o sucesso.
      setData('')
      setDescricao('')
      setHoras('')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao registrar atividade.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground">
        Registrar Nova Atividade
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Informe os dados da tarefa realizada.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="data" className="text-sm font-medium text-foreground">
            Data
          </label>
          <input
            id="data"
            name="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="descricao"
            className="text-sm font-medium text-foreground"
          >
            Descrição da Tarefa
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva a atividade realizada..."
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="horas" className="text-sm font-medium text-foreground">
            Horas Dedicadas
          </label>
          <input
            id="horas"
            name="horas"
            type="number"
            min="0"
            step="0.5"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            placeholder="Ex.: 4"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
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
          disabled={enviando}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Salvando...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Registrar Atividade
            </>
          )}
        </button>
      </form>
    </div>
  )
}
