import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import JobForum from '../components/JobForum';
import { ProfilePage } from './ProfilePage';
import { AlumniSearchPage } from './AlumniSearchPage';
import { MapPage } from './MapPage';
import HomePage from './HomePage';
import ShopPage from './ShopPage';
import type { Announcement } from '../types';
import './Dashboard.css';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // LocalStorage'dan duyuruları yükle
    const storedAnnouncements = JSON.parse(
      localStorage.getItem('announcements') || '[]'
    );
    // Sabitle olanları önce göster
    const sorted = storedAnnouncements.sort(
      (a: Announcement, b: Announcement) =>
        (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
    );
    setAnnouncements(sorted);
  }, []);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'jobs':
        return <JobForum />;
      case 'alumni':
        return <AlumniSearchPage />;
      case 'profile':
        return <ProfilePage />;
      case 'map':
        return <MapPage />;
      case 'shop':
        return <ShopPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Başkent Mezunları Ağı</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </header>

        {/* Duyurular Bölümü */}
        {announcements.length > 0 && (
          <div className="announcements-banner">
            <div className="announcements-container">
              <h3>📢 Duyurular</h3>
              <div className="announcements-scroll">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`announcement-banner-item ${
                      announcement.isPinned ? 'pinned' : ''
                    }`}
                  >
                    <div className="announcement-banner-header">
                      <strong>{announcement.title}</strong>
                      {announcement.isPinned && <span className="pin-badge">📌</span>}
                    </div>
                    <p className="announcement-banner-desc">
                      {announcement.description || announcement.content.substring(0, 100)}...
                    </p>
                    <small>
                      {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
