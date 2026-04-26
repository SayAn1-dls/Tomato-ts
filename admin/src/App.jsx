import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  return (
    <div className='app'>
      <ToastContainer />
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      {isLoggedIn && <hr />}
      <div className="app-content">
        {isLoggedIn && <Sidebar />}
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/add" element={isLoggedIn ? <Add /> : <Navigate to="/login" />} />
          <Route path="/list" element={isLoggedIn ? <List /> : <Navigate to="/login" />} />
          <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
