import { Routes, Route } from 'react-router-dom';
import { Monitor } from 'lucide-react';
// import { Monitor } from './pages/Monitor';
// import { Dams } from './pages/Dams';
// import { Analytics } from './pages/Analytics';
// import { Report } from './pages/Report';
// import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Header  from './components/main/Header';
import Footer from './components/main/Footer';

import MapPage from './pages/MapPage';
import ObjectsPage from './pages/ObjectsPage';
import Login from './pages/Login';
import Home from './pages/Home';
import FloodPredictorsPage from './pages/FloodPredictors';
import { WaterResources } from './components/water_resourses/WaterResourcesPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-teal-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/objects" element={<ObjectsPage />} />
          <Route path="/object" element={<WaterResources />} />
          <Route path="/flood-predictors" element={<FloodPredictorsPage />} />


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

