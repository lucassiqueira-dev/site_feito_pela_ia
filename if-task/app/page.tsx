'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/login-form'
import { Dashboard } from '@/components/dashboard'
import type { Bolsista } from '@/lib/types'

export default function Page() {
  // Estado de autenticação mantido no cliente para fins de demonstração.
  // Ao integrar com o backend, este estado pode ser substituído/hidratado por
  // uma sessão real (ex.: token validado no servidor, cookie httpOnly, etc.).
  const [bolsista, setBolsista] = useState<Bolsista | null>(null)

  if (!bolsista) {
    return <LoginForm onLogin={setBolsista} />
  }

  return <Dashboard bolsista={bolsista} onLogout={() => setBolsista(null)} />
}
