export const API_URL = import.meta.env.VITE_API_URL || 'https://tomato-ts-qmzk.onrender.com'

export const adminHeaders = () => ({
    token: localStorage.getItem('adminToken')
})
