import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Announcement, SystemLog } from '../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/AdminDashboard.css';

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

  // Duyuru Formu
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    description: '',
    category: 'General' as 'General' | 'Event' | 'Job' | 'Important' | 'Announcement',
    isPinned: false,
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }

    // LocalStorage'dan duyuruları ve logları yükle
    const storedAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const storedLogs = JSON.parse(localStorage.getItem('systemLogs') || '[]');

    setAnnouncements(storedAnnouncements);
    setSystemLogs(storedLogs.reverse()); // En yeniler ilk
  }, [user, navigate]);

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      description: newAnnouncement.description,
      category: newAnnouncement.category,
      authorId: user?.id || '',
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: newAnnouncement.isPinned,
    };

    const updatedAnnouncements = [announcement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));

    setNewAnnouncement({
      title: '',
      content: '',
      description: '',
      category: 'General',
      isPinned: false,
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // İstatistikler
  const stats = {
    totalAnnouncements: announcements.length,
    totalLogs: systemLogs.length,
    totalUsers: new Set(systemLogs.map(log => log.userId)).size,
  };

  // Grafik verilerini oluştur
  const generateActivityChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric',
      });
      const logsForDay = systemLogs.filter(log =>
        log.timestamp.startsWith(date.toISOString().split('T')[0])
      ).length;
      data.push({
        date: dateStr,
        activities: logsForDay,
      });
    }
    return data;
  };

  const generateStatusChartData = () => {
    const success = systemLogs.filter(l => l.status === 'success').length;
    const error = systemLogs.filter(l => l.status === 'error').length;
    return [
      { name: 'Başarılı', value: success, color: '#10b981' },
      { name: 'Hata', value: error, color: '#ef4444' },
    ];
  };

  const generateActionChartData = () => {
    const actionCounts: { [key: string]: number } = {};
    systemLogs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    return Object.entries(actionCounts)
      .map(([action, count]) => ({
        action: action.replace('_', ' ').toUpperCase(),
        count,
      }))
      .slice(0, 5);
  };

  const activityData = generateActivityChartData();
  const statusData = generateStatusChartData();
  const actionData = generateActionChartData();

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <img src="/images/baskent-logo.png" alt="Başkent Logo" className="header-logo" />
          <h1>🔐 Admin Paneli</h1>
        </div>
        <div className="header-right">
          <span className="admin-name">Admin: {user.firstName} {user.lastName}</span>
          <button onClick={handleLogout} className="btn-logout">Çıkış Yap</button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          📢 Duyurular ({announcements.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Sistem Logları ({systemLogs.length})
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h2>Sistem Özeti</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📢</div>
                <div className="stat-info">
                  <p className="stat-label">Toplam Duyuru</p>
                  <p className="stat-value">{stats.totalAnnouncements}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <p className="stat-label">Aktif Kullanıcılar</p>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <p className="stat-label">Sistem Olayları</p>
                  <p className="stat-value">{stats.totalLogs}</p>
                </div>
              </div>
            </div>

            {/* Grafikler */}
            <div className="charts-grid">
              {/* Aktivite Grafiği */}
              <div className="chart-container">
                <h3>Son 7 Gün Aktivite</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="activities"
                      stroke="#667eea"
                      strokeWidth={2}
                      dot={{ fill: '#667eea', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Başarı/Hata Oranı */}
              <div className="chart-container">
                <h3>İşlem Durumu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* En Sık İşlemler */}
              <div className="chart-container full-width">
                <h3>En Sık Gerçekleştirilen İşlemler</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={actionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="action" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* En Son Loglar */}
            <div className="recent-logs">
              <h3>Son 10 Sistem Olayı</h3>
              <div className="logs-list">
                {systemLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className={`log-item ${log.status}`}>
                    <div className="log-time">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </div>
                    <div className="log-info">
                      <strong>{log.userName}</strong>
                      <span className="log-action">{log.action}</span>
                      <p>{log.description}</p>
                    </div>
                    <div className={`log-status ${log.status}`}>
                      {log.status === 'success' ? '✓' : '✕'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="tab-content">
            <h2>Duyuru Yönetimi</h2>

            {/* Yeni Duyuru Formu */}
            <div className="announcement-form">
              <h3>Yeni Duyuru Oluştur</h3>
              <form onSubmit={handleAddAnnouncement}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Başlık *</label>
                    <input
                      type="text"
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          title: e.target.value,
                        })
                      }
                      placeholder="Duyuru başlığı"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Kategori</label>
                    <select
                      id="category"
                      value={newAnnouncement.category}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          category: e.target.value as any,
                        })
                      }
                    >
                      <option value="General">Genel</option>
                      <option value="Event">Etkinlik</option>
                      <option value="Job">İş İlanı</option>
                      <option value="Important">Önemli</option>
                      <option value="Announcement">Duyuru</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Kısa Açıklama</label>
                  <input
                    type="text"
                    id="description"
                    value={newAnnouncement.description}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        description: e.target.value,
                      })
                    }
                    placeholder="Duyurunun kısa özeti"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">İçerik *</label>
                  <textarea
                    id="content"
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        content: e.target.value,
                      })
                    }
                    placeholder="Duyuru içeriğini yazın..."
                    rows={6}
                    required
                  />
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={newAnnouncement.isPinned}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        isPinned: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="isPinned">Üst başta Sabitle</label>
                </div>

                <button type="submit" className="btn-submit">
                  Duyuru Yayınla
                </button>
              </form>
            </div>

            {/* Duyurular Listesi */}
            <div className="announcements-list">
              <h3>Yayınlanan Duyurular</h3>
              {announcements.length === 0 ? (
                <p className="empty-message">Henüz duyuru yok</p>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`announcement-item ${
                      announcement.isPinned ? 'pinned' : ''
                    }`}
                  >
                    <div className="announcement-header">
                      <div>
                        <h4>
                          {announcement.isPinned && '📌 '}
                          {announcement.title}
                        </h4>
                        <p className="category-badge">{announcement.category}</p>
                      </div>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDeleteAnnouncement(announcement.id)
                        }
                      >
                        Sil
                      </button>
                    </div>
                    <p className="announcement-description">
                      {announcement.description}
                    </p>
                    <p className="announcement-meta">
                      Yazar: {announcement.authorName} •{' '}
                      {new Date(
                        announcement.createdAt
                      ).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="tab-content">
            <h2>Sistem Logları</h2>

            <div className="logs-container">
              {systemLogs.length === 0 ? (
                <p className="empty-message">Henüz log yok</p>
              ) : (
                systemLogs.map((log) => (
                  <div key={log.id} className={`log-item ${log.status}`}>
                    <div className="log-header">
                      <span className="log-action-badge">{log.action}</span>
                      <span className={`log-status-badge ${log.status}`}>
                        {log.status}
                      </span>
                      <span className="log-time">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="log-body">
                      <strong>{log.userName}</strong> - {log.description}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
