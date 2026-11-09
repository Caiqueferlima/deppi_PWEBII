import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Logout from './pages/Logout'
import AdminHome from './pages/AdminHome'
import InstitutionsPage from './pages/InstitutionsPage'
import UsersPage from './pages/UsersPage'
import { ThemeProvider } from './components/ThemeContext'
import { getPrimaryRole, getSessionUser, type AppRole } from './lib/authSession'
import { AlunoHomePage, DeppiHomePage, ProfessorHomePage } from './pages/RoleHomes'

function HomeRedirect() {
  const user = getSessionUser();
  const role = user ? getPrimaryRole(user) : null;
  if (!role) return <Navigate to="/login" replace />;
  const paths: Record<AppRole, string> = {
    ADMIN: "/inicio/admin",
    DEPPI: "/inicio/deppi",
    PROFESSOR: "/inicio/professor",
    ALUNO: "/inicio/aluno",
  };
  return <Navigate to={paths[role]} replace />;
}

function RoleRoute({ role, children }: { role: AppRole; children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user || !user.roles.includes(role)) return <Navigate to="/inicio" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/inicio" element={<HomeRedirect />} />
        <Route path="/inicio/admin" element={<RoleRoute role="ADMIN"><AdminHome /></RoleRoute>} />
        <Route path="/inicio/deppi" element={<DeppiHomePage />} />
        <Route path="/inicio/professor" element={<ProfessorHomePage />} />
        <Route path="/inicio/aluno" element={<AlunoHomePage />} />
        <Route path="/instituicoes" element={<RoleRoute role="ADMIN"><InstitutionsPage /></RoleRoute>} />
        <Route path="/usuarios" element={<RoleRoute role="ADMIN"><UsersPage /></RoleRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App;
