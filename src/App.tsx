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
import { Header } from './components/main/Header';
import Footer from './components/main/Footer';
import MapPage from './pages/MapPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-teal-50">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<MapPage />} />
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
          <Route path="*" element=Headerigate to="/" />} /> */}
          
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

