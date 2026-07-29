import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  titulo: string
  valor: string
  descricao: string
  icon: LucideIcon
}

export function StatsCard({ titulo, valor, descricao, icon: Icon }: StatsCardProps) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-card-foreground">
          {valor}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{descricao}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  )
}
