import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Logout from './pages/Logout'
import AdminHome from './pages/AdminHome'
import InstitutionsPage from './pages/InstitutionsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/inicio" element={<AdminHome />} />
      <Route path="/instituicoes" element={<InstitutionsPage />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App;
