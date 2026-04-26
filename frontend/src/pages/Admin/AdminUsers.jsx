import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const getUrl = () => import.meta.env.PROD
    ? 'https://tomato-ts-qmzk.onrender.com'
    : (import.meta.env.VITE_API_URL || 'http://localhost:5002')

const AdminUsers = () => {
    const [users, setUsers]     = useState([])
    const [search, setSearch]   = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('adminToken')
                const res = await axios.get(`${getUrl()}/api/admin/users`, { headers: { token } })
                if (res.data.success) setUsers(res.data.data)
                else toast.error('Failed to load users')
            } catch { toast.error('Server error') }
            setLoading(false)
        }
        fetch()
    }, [])

    const filtered = users.filter(u => {
        const q = search.toLowerCase()
        return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    })

    if (loading) return <div className="no-data">Loading users…</div>

    return (
        <div>
            <h2 className="admin-page-title">Users ({users.length})</h2>
            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <h3>Registered Users</h3>
                    <input className="search-input" placeholder="Search name / email…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {filtered.length === 0
                    ? <div className="no-data">No users found</div>
                    : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, i) => (
                                    <tr key={user._id}>
                                        <td style={{ color: '#aaa', fontSize: 12 }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                                        <td style={{ color: '#555' }}>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.orderCount > 0 ? 'badge-blue' : 'badge-yellow'}`}>
                                                {user.orderCount} order{user.orderCount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            {user.totalSpent > 0 ? `₹${user.totalSpent.toFixed(2)}` : '—'}
                                        </td>
                                        <td style={{ fontSize: 12, color: '#888' }}>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
            </div>
        </div>
    )
}

export default AdminUsers
