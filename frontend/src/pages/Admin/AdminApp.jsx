import React, { useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminMenu from './AdminMenu'
import AdminOrders from './AdminOrders'
import AdminUsers from './AdminUsers'
import './admin.css'

const Sidebar = () => (
    <aside className="admin-sidebar">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
            <span className="admin-nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/menu" className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
            <span className="admin-nav-icon">🍔</span> Menu Items
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
            <span className="admin-nav-icon">📦</span> Orders
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
            <span className="admin-nav-icon">👥</span> Users
        </NavLink>
    </aside>
)

const AdminShell = ({ onLogout }) => (
    <div className="admin-shell">
        <header className="admin-topbar">
            <div className="admin-topbar-left">
                <span className="admin-topbar-logo">Tomato</span>
                <span className="admin-topbar-badge">Admin</span>
            </div>
            <div className="admin-topbar-right">
                <span className="admin-topbar-email">{process.env.REACT_APP_ADMIN_EMAIL || 'Admin'}</span>
                <button className="admin-logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </header>
        <div className="admin-body">
            <Sidebar />
            <main className="admin-main">
                <Routes>
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="menu" element={<AdminMenu />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
            </main>
        </div>
    </div>
)

const AdminApp = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        setIsLoggedIn(false)
    }

    if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />

    return <AdminShell onLogout={handleLogout} />
}

export default AdminApp
