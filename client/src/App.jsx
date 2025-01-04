import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'


function App() {
  return (
    <>
    <Routes>
      <Route path='/login'  element={<Login/>}/>
      <Route path='/' element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    <Toaster/>
    </>

    
  )
}

export default App