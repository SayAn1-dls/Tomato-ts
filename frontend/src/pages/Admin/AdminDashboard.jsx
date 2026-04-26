import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const getUrl = () => import.meta.env.PROD
    ? 'https://tomato-ts-qmzk.onrender.com'
    : (import.meta.env.VITE_API_URL || 'http://localhost:5002')

const StatCard = ({ label, value, color, prefix = '' }) => (
    <div className="admin-stat-card" style={{ borderTopColor: color }}>
        <div className="admin-stat-value">{prefix}{typeof value === 'number' ? value.toLocaleString() : '—'}</div>
        <div className="admin-stat-label">{label}</div>
    </div>
)

const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('adminToken')
                const res = await axios.get(`${getUrl()}/api/admin/stats`, { headers: { token } })
                if (res.data.success) setStats(res.data.data)
                else toast.error('Failed to load stats')
            } catch { toast.error('Server error') }
            setLoading(false)
        }
        fetch()
    }, [])

    if (loading) return <div className="no-data">Loading stats…</div>

    return (
        <div>
            <h2 className="admin-page-title">Dashboard</h2>
            <div className="admin-stats-grid">
                <StatCard label="Total Orders"    value={stats?.totalOrders}   color="#FF6347" />
                <StatCard label="Paid Orders"     value={stats?.paidOrders}    color="#22c55e" />
                <StatCard label="Revenue"         value={stats?.totalRevenue != null ? parseFloat(stats.totalRevenue).toFixed(2) : 0} prefix="₹" color="#3b82f6" />
                <StatCard label="Menu Items"      value={stats?.menuItems}     color="#f59e0b" />
                <StatCard label="Registered Users" value={stats?.totalUsers}   color="#8b5cf6" />
            </div>
            <div className="admin-stats-grid">
                <StatCard label="Processing"      value={stats?.pendingOrders}    color="#f59e0b" />
                <StatCard label="Out for Delivery" value={stats?.outForDelivery}  color="#3b82f6" />
                <StatCard label="Delivered"       value={stats?.delivered}         color="#22c55e" />
            </div>
        </div>
    )
}

export default AdminDashboard
