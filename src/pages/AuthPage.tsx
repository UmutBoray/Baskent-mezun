import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const AuthPage: React.FC = () => {
  console.log('AuthPage component rendering...');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    '/images/genel-gorunum.jfif',
    '/images/muhendislik-fakultesi.jpg',
    '/images/kampus-gorunum.webp'
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // Admin ise admin login'e yönlendir
  useEffect(() => {
    if (user && user.isAdmin) {
      console.log('👤 Admin detected in user login page, redirecting to admin');
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        if (!firstName || !lastName) {
          setError('Lütfen tüm alanları doldurunuz');
          setLoading(false);
          return;
        }
        await register(email, password, firstName, lastName);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Carousel with Overlay */}
      <div className="auth-carousel-wrapper">
        <div className="auth-bg-carousel">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
            >
              <img src={image} alt={`Başkent Üniversitesi ${index + 1}`} className="auth-bg-image" />
            </div>
          ))}
        </div>
        {/* Dark overlay for better contrast */}
        <div className="auth-overlay"></div>
        
        {/* Carousel indicators */}
        <div className="carousel-indicators">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Fotoğraf ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="auth-content">
        <div className="auth-box">
          {/* Logo and Title */}
          <div className="auth-header">
            <div className="logo-container">
              <img src="/images/baskent-logo.png" alt="Başkent Logo" className="auth-logo" />
            </div>
            <h1 className="auth-title">Başkent Mezunları Ağı</h1>
            <p className="auth-subtitle">Mezunlar Platformuna Hoş Geldiniz</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            {!isLogin && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Ad</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Adınız"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Soyadı</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Soyadınız"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          {/* Toggle and Links */}
          <div className="auth-footer">
            <div className="auth-toggle">
              <p>
                {isLogin ? 'Henüz üye değil misiniz?' : 'Zaten üye misiniz?'}
                {' '}
                <button
                  type="button"
                  className="toggle-button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                >
                  {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                </button>
              </p>
            </div>

            <div className="admin-link">
              <p>
                Admin mısınız? <a href="/admin">Admin Paneline Git</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
