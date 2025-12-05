import { Routes, Route, Link } from 'react-router-dom';
import { Waves, Map, AlertTriangle, BarChart3, FileText, Monitor } from 'lucide-react';
import Login from './components/auth/Login';
import Home from '../src/pages/Home';
// import { Monitor } from './pages/Monitor';
// import { Dams } from './pages/Dams';
// import { Analytics } from './pages/Analytics';
// import { Report } from './pages/Report';
// import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-teal-50">
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/monitor"
            element={
              <ProtectedRoute allowedRoles={['guest', 'expert']}>
                <Monitor />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/dams"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <Dams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </div>
    </AuthProvider>
  );
}

function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-xl border-b border-cyan-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold bg-linear-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent"
        >
          GidroAtlas Pro
        </Link>
        <div className="flex gap-8 text-lg font-medium">
          <Link to="/" className="flex items-center gap-2 hover:text-cyan-600 transition">
            <Waves className="w-6 h-6" /> Главная
          </Link>
          <Link to="/monitor" className="flex items-center gap-2 hover:text-cyan-600 transition">
            <Map className="w-6 h-6" /> Мониторинг
          </Link>
          {user?.role === 'expert' && (
            <>
              <Link to="/dams" className="flex items-center gap-2 hover:text-red-600 transition">
                <AlertTriangle className="w-6 h-6" /> ГТС
              </Link>
              <Link to="/analytics" className="flex items-center gap-2 hover:text-cyan-600 transition">
                <BarChart3 className="w-6 h-6" /> Аналитика
              </Link>
              <Link to="/report" className="flex items-center gap-2 hover:text-cyan-600 transition">
                <FileText className="w-6 h-6" /> Отчёт
              </Link>
            </>
          )}
          {user ? (
            <button onClick={logout} className="text-red-500 hover:underline">
              Выйти
            </button>
          ) : (
            <Link to="/login" className="text-cyan-600 hover:underline">
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
