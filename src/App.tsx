import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import TestPage from './pages/TestPage';
import DashboardPage from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AlumniSearchPage } from './pages/AlumniSearchPage';
import { MapPage } from './pages/MapPage';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

function App() {
  console.log('App component rendering...');
  try {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/alumni" element={<AlumniSearchPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/admin" element={<AdminAuthPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  } catch (error) {
    console.error('App rendering error:', error);
    return <div style={{ color: 'red', padding: '20px' }}>Error loading app: {String(error)}</div>;
  }
}

export default App;
