export type User = {
  id: number
  firstname: string
  lastname: string
  age: number
  date_of_birth: string
}

export type UserCreate = {
  firstname: string
  lastname: string
  date_of_birth: string
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export async function listUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`)
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function createUser(u: UserCreate): Promise<User> {
  const res = await fetch(`${API_BASE}/users/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(u),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}

export async function deleteUser(id: number): Promise<void> {
  const url = new URL(`${API_BASE}/user`, window.location.origin)
  url.searchParams.set('id', String(id))
  const res = await fetch(url.toString().replace(window.location.origin, ''), { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete user')
}
