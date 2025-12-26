import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminAuth.css';

const AdminAuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin, user } = useAuth();

  // User güncellendiğinde kontrol et
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        console.log('✅ Admin detected, redirecting to dashboard');
        navigate('/admin/dashboard');
      } else {
        // Non-admin user ise loading false yap
        console.log('⚠️ Non-admin user tried to access admin login');
        setIsLoading(false);
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Admin login attempt with email:', email);
      await adminLogin(email, password);
      console.log('✅ Admin login successful, user should be updated');
      // User state güncellendiğinde useEffect otomatik navigate edicek
    } catch (err) {
      console.error('❌ Admin login error:', err);
      setError(err instanceof Error ? err.message : 'Admin giriş başarısız. E-mail veya şifre hatalı.');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <img src="/images/baskent-logo.png" alt="Başkent Logo" className="admin-auth-logo" />
          <h1>Admin Paneli</h1>
          <p>Başkent Üniversitesi Yönetim Sistemi</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Admin E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Admin Olarak Giriş Yap'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Mezun mısınız? <a href="/">Kullanıcı girişi</a>
          </p>
        </div>

        {/* Demo Bilgileri */}
        <div className="demo-credentials">
          <p><strong>Demo Admin Credentials:</strong></p>
          <p>Email: admin@baskent.edu.tr</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
