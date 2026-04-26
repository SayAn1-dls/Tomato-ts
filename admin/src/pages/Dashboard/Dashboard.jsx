import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { url, currency } from '../../assets/assets'
import { toast } from 'react-toastify'

const StatCard = ({ label, value, color, prefix }) => (
    <div className='stat-card' style={{ borderTopColor: color }}>
        <p className='stat-value'>{prefix || ''}{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className='stat-label'>{label}</p>
    </div>
)

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const response = await axios.get(`${url}/api/admin/stats`, { headers: { token } })
            if (response.data.success) {
                setStats(response.data.data)
            } else {
                toast.error('Failed to load stats')
            }
        } catch {
            toast.error('Could not connect to server')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStats()
    }, [])

    if (loading) return <div className='dashboard'><div className='loading'>Loading stats...</div></div>

    return (
        <div className='dashboard'>
            <h2 className='dashboard-title'>Dashboard</h2>
            <div className='stats-grid'>
                <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} color="#FF6347" />
                <StatCard label="Paid Orders" value={stats?.paidOrders ?? 0} color="#22c55e" />
                <StatCard label="Total Revenue" value={(stats?.totalRevenue ?? 0).toFixed(2)} prefix={currency} color="#3b82f6" />
                <StatCard label="Menu Items" value={stats?.menuItems ?? 0} color="#f59e0b" />
            </div>
            <div className='stats-grid' style={{ marginTop: 0 }}>
                <StatCard label="Processing" value={stats?.pendingOrders ?? 0} color="#f59e0b" />
                <StatCard label="Out for Delivery" value={stats?.outForDelivery ?? 0} color="#8b5cf6" />
                <StatCard label="Delivered" value={stats?.delivered ?? 0} color="#22c55e" />
            </div>
        </div>
    )
}

export default Dashboard
