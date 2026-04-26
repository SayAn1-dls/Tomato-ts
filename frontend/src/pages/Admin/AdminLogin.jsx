import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from './adminApi'
import './admin.css'

const AdminLogin = ({ onLogin }) => {
    const [data, setData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }))

    const onSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/api/admin/login`, data)
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token)
                toast.success('Welcome back!')
                onLogin()
            } else {
                toast.error(res.data.message || 'Invalid credentials')
            }
        } catch {
            toast.error('Cannot reach server')
        }
        setLoading(false)
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <h1>🍅 Tomato</h1>
                <p className="admin-login-subtitle">Admin Portal — Sign in to continue</p>
                <form className="admin-login-form" onSubmit={onSubmit}>
                    <div className="form-field">
                        <label>Email</label>
                        <input type="email" name="email" value={data.email} onChange={onChange}
                            placeholder="admin@tomato.com" required autoFocus />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input type="password" name="password" value={data.password} onChange={onChange}
                            placeholder="••••••••" required />
                    </div>
                    <button className="admin-login-submit" type="submit" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
