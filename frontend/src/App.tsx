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
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, Arial' }}>
      <h1>User Manager</h1>

      <section style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, marginBottom: '1rem' }}>
        <h2>Add User</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>First name</span>
            <input
              placeholder="First name"
              value={form.firstname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, firstname: e.target.value })}
              required
            />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>Last name</span>
            <input
              placeholder="Last name"
              value={form.lastname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, lastname: e.target.value })}
              required
            />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>Date of birth</span>
            <input
              type="date"
              placeholder="YYYY-MM-DD"
              value={form.date_of_birth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, date_of_birth: e.target.value })}
              required
            />
          </label>
          <button type="submit">Create</button>
        </form>
      </section>

      <section style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Users</h2>
        {loading ? <p>Loading...</p> : null}
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
        {users.length === 0 ? <p>No users yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">First</th>
                <th align="left">Last</th>
                <th align="left">Age</th>
                <th align="left">DOB</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.firstname}</td>
                  <td>{u.lastname}</td>
                  <td>{u.age}</td>
                  <td>{u.date_of_birth}</td>
                  <td>
                    <button onClick={() => onDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
