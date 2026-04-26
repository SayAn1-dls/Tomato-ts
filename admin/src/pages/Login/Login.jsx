import React, { useState } from 'react'
import './Login.css'
import { assets, url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ onLogin }) => {
    const [data, setData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setData(d => ({ ...d, [e.target.name]: e.target.value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${url}/api/admin/login`, data)
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token)
                toast.success('Welcome back!')
                onLogin()
            } else {
                toast.error(response.data.message || 'Invalid credentials')
            }
        } catch {
            toast.error('Server error. Make sure backend is running.')
        }
        setLoading(false)
    }

    return (
        <div className='login-page'>
            <div className='login-card'>
                <img src={assets.logo} alt="Tomato" className='login-logo' />
                <h2>Admin Portal</h2>
                <p className='login-subtitle'>Sign in to manage your restaurant</p>
                <form onSubmit={onSubmit} className='login-form'>
                    <div className='login-field'>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={onChangeHandler}
                            placeholder="admin@tomato.com"
                            required
                        />
                    </div>
                    <div className='login-field'>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={onChangeHandler}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className='login-btn' disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
