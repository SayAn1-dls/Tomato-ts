import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL, adminHeaders } from './adminApi'

const STATUS_OPTS = ['Food Processing', 'Out for delivery', 'Delivered']
const FILTERS = ['All', ...STATUS_OPTS]

const statusBadge = s => {
    if (s === 'Food Processing') return 'badge badge-yellow'
    if (s === 'Out for delivery') return 'badge badge-blue'
    return 'badge badge-green'
}

const AdminOrders = () => {
    const [orders, setOrders]   = useState([])
    const [filter, setFilter]   = useState('All')
    const [search, setSearch]   = useState('')
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/order/list`, { headers: adminHeaders() })
            if (res.data.success) setOrders(res.data.data.reverse())
            else toast.error('Failed to load orders')
        } catch (err) { console.error(err); toast.error('Server error') }
        setLoading(false)
    }

    const updateStatus = async (orderId, status) => {
        const res = await axios.post(`${API_URL}/api/order/status`, { orderId, status }, { headers: adminHeaders() })
        if (res.data.success) fetchOrders()
        else toast.error('Update failed')
    }

    useEffect(() => { fetchOrders() }, [])

    const filtered = orders
        .filter(o => filter === 'All' || o.status === filter)
        .filter(o => {
            const q = search.toLowerCase()
            return !q ||
                (o.address.firstName + ' ' + o.address.lastName).toLowerCase().includes(q) ||
                o.address.email?.toLowerCase().includes(q) ||
                o._id.includes(q)
        })

    if (loading) return <div className="no-data">Loading orders…</div>

    return (
        <div>
            <h2 className="admin-page-title">Orders</h2>

            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <h3>All Orders ({filtered.length})</h3>
                        <div className="filter-tabs">
                            {FILTERS.map(f => (
                                <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                            ))}
                        </div>
                    </div>
                    <input className="search-input" placeholder="Search customer / order ID…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {filtered.length === 0
                    ? <div className="no-data">No orders found</div>
                    : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Mode</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <tr key={order._id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#888' }}>
                                            {order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{order.address.firstName} {order.address.lastName}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>{order.address.phone}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>{order.address.city}, {order.address.state}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 12 }}>
                                                {order.items.map((item, i) => (
                                                    <span key={i}>{item.name} ×{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                                                ))}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{order.items.length} item(s)</div>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>₹{order.amount}</td>
                                        <td>
                                            <span className={`badge ${order.payment ? 'badge-green' : 'badge-red'}`}>
                                                {order.payment ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-purple">
                                                {order.payment ? 'Online' : 'COD'}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select"
                                                value={order.status}
                                                onChange={e => updateStatus(order._id, e.target.value)}
                                            >
                                                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                                            {new Date(order.date || order.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
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

export default AdminOrders
