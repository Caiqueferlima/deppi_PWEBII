import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Logout from './pages/Logout'
import AdminHome from './pages/AdminHome'
import InstitutionsPage from './pages/InstitutionsPage'
import UsersPage from './pages/UsersPage'
import { ThemeProvider } from './components/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/inicio" element={<AdminHome />} />
        <Route path="/instituicoes" element={<InstitutionsPage />} />
        <Route path="/usuarios" element={<UsersPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App;
