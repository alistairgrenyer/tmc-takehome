import React, { useEffect, useState } from 'react'
import { createUser, deleteUser, listUsers, type User, type UserCreate } from './api'

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<UserCreate>({ firstname: '', lastname: '', date_of_birth: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers()
      setUsers(data)
    } catch (e: any) {
      setError(e.message || 'Error loading users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      await createUser(form)
      setForm({ firstname: '', lastname: '', date_of_birth: '' })
      await load()
    } catch (e: any) {
      setError(e.message || 'Error creating user')
    }
  }

  const onDelete = async (id: number) => {
    try {
      await deleteUser(id)
      await load()
    } catch (e: any) {
      setError(e.message || 'Error deleting user')
    }
  }

  return (
    <div className="mx-auto max-w-3xl min-h-screen bg-gray-50 text-gray-900 p-6 font-sans antialiased">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">User Manager</h1>
        <p className="text-sm text-gray-500">Create, list and delete users.</p>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-medium">Add User</h2>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-gray-700">First name</span>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none ring-blue-500 focus:ring-2 shadow-sm"
              placeholder="First name"
              value={form.firstname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, firstname: e.target.value })}
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Last name</span>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none ring-blue-500 focus:ring-2 shadow-sm"
              placeholder="Last name"
              value={form.lastname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, lastname: e.target.value })}
              required
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm text-gray-700">Date of birth</span>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none ring-blue-500 focus:ring-2 shadow-sm"
              type="date"
              placeholder="YYYY-MM-DD"
              value={form.date_of_birth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, date_of_birth: e.target.value })}
              required
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Create
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-medium">Users</h2>
          {loading && <span className="text-sm text-gray-500">Loading…</span>}
        </div>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2 pr-2">ID</th>
                  <th className="py-2 pr-2">First</th>
                  <th className="py-2 pr-2">Last</th>
                  <th className="py-2 pr-2">Age</th>
                  <th className="py-2 pr-2">DOB</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-2">{u.id}</td>
                    <td className="py-2 pr-2">{u.firstname}</td>
                    <td className="py-2 pr-2">{u.lastname}</td>
                    <td className="py-2 pr-2">{u.age}</td>
                    <td className="py-2 pr-2">{u.date_of_birth}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onDelete(u.id)}
                        className="inline-flex items-center rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
