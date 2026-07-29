import { CalendarDays, Clock, Inbox } from 'lucide-react'
import type { Atividade } from '@/lib/types'

interface ActivityTableProps {
  atividades: Atividade[]
  carregando: boolean
}

/** Formata "AAAA-MM-DD" para o padrão brasileiro "DD/MM/AAAA". */
function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return iso
  return `${dia}/${mes}/${ano}`
}

export function ActivityTable({ atividades, carregando }: ActivityTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Histórico de Atividades
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tarefas registradas no período.
          </p>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          {atividades.length} registro{atividades.length === 1 ? '' : 's'}
        </span>
      </div>

      {carregando ? (
        <div className="flex flex-col gap-3 p-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-muted"
              aria-hidden="true"
            />
          ))}
          <span className="sr-only">Carregando atividades...</span>
        </div>
      ) : atividades.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Nenhuma atividade registrada
          </p>
          <p className="text-sm text-muted-foreground">
            Use o formulário ao lado para adicionar sua primeira tarefa.
          </p>
        </div>
      ) : (
        <>
          {/* Tabela (telas médias e maiores) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-6 py-3 font-medium">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-right font-medium">
                    Horas
                  </th>
                </tr>
              </thead>
              <tbody>
                {atividades.map((atividade) => (
                  <tr
                    key={atividade.id}
                    className="border-b border-border/60 transition last:border-0 hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                      {formatarData(atividade.data)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {atividade.descricao}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-foreground">
                      {atividade.horas}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (telas pequenas) */}
          <ul className="flex flex-col gap-3 p-4 md:hidden">
            {atividades.map((atividade) => (
              <li
                key={atividade.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {atividade.descricao}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatarData(atividade.data)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {atividade.horas}h
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
