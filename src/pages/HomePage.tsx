import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { DailyTask, WeeklyLogin } from '../types';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [weeklyLogin, setWeeklyLogin] = useState<WeeklyLogin | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [achievementMessage, setAchievementMessage] = useState('');

  // Haftalık giriş takibi
  const WEEKLY_TASKS: DailyTask[] = [
    {
      id: 'login-mon',
      title: 'Pazartesi Girişi',
      description: 'Pazartesi gün giriş yap',
      icon: '🌅',
      completed: false,
      reward: 10,
    },
    {
      id: 'login-tue',
      title: 'Salı Girişi',
      description: 'Salı gün giriş yap',
      icon: '📚',
      completed: false,
      reward: 10,
    },
    {
      id: 'login-wed',
      title: 'Çarşamba Girişi',
      description: 'Çarşamba gün giriş yap',
      icon: '⛅',
      completed: false,
      reward: 10,
    },
    {
      id: 'login-thu',
      title: 'Perşembe Girişi',
      description: 'Perşembe gün giriş yap',
      icon: '🌞',
      completed: false,
      reward: 10,
    },
    {
      id: 'login-fri',
      title: 'Cuma Girişi',
      description: 'Cuma gün giriş yap',
      icon: '🎉',
      completed: false,
      reward: 10,
    },
    {
      id: 'login-sat',
      title: 'Cumartesi Girişi',
      description: 'Cumartesi gün giriş yap',
      icon: '⭐',
      completed: false,
      reward: 15,
    },
    {
      id: 'login-sun',
      title: 'Pazar Girişi',
      description: 'Pazar gün giriş yap',
      icon: '👑',
      completed: false,
      reward: 15,
    },
  ];

  useEffect(() => {
    // Haftalık giriş verilerini yükle
    if (user) {
      const storedWeeklyLogin = localStorage.getItem(
        `weekly-login-${user.id}`
      );
      const today = new Date().toISOString().split('T')[0];

      let weekly: WeeklyLogin;
      if (storedWeeklyLogin) {
        weekly = JSON.parse(storedWeeklyLogin);

        // Bugün zaten giriş yapıldı mı kontrol et
        if (!weekly.loginDates.includes(today)) {
          weekly.loginDates.push(today);
          // Hafta başından itibaren günü hesapla
          const weekStart = getWeekStart(new Date(today));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          const weekLogins = weekly.loginDates.filter((date) => {
            const d = new Date(date);
            return d >= weekStart && d <= weekEnd;
          });
          weekly.currentWeekStreak = weekLogins.length;
          if (weekLogins.length > weekly.bestWeekStreak) {
            weekly.bestWeekStreak = weekLogins.length;
          }
          weekly.totalLoginDays = weekly.loginDates.length;
        }
      } else {
        weekly = {
          userId: user.id,
          loginDates: [today],
          currentWeekStreak: 1,
          bestWeekStreak: 1,
          totalLoginDays: 1,
        };
      }

      setWeeklyLogin(weekly);
      localStorage.setItem(`weekly-login-${user.id}`, JSON.stringify(weekly));

      // Günü göre görevleri işaretle
      const updatedTasks = WEEKLY_TASKS.map((task) => ({
        ...task,
        completed: weekly.loginDates.some((date) =>
          date.includes(getDayFromTask(task.id))
        ),
      }));

      setTasks(updatedTasks);
      setUserPoints(user.points || 0);

      // Tüm hafta tamamlandı mı kontrol et
      if (weekly.currentWeekStreak === 7) {
        setAchievementMessage('Hafta Tamamlandı! 🏆 +50 Bonus Puan!');
        setTimeout(() => setAchievementMessage(''), 4000);
      }
    }
  }, [user]);

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi başlasın
    return new Date(d.setDate(diff));
  };

  const getDayFromTask = (taskId: string): string => {
    const dayMap: { [key: string]: string } = {
      'login-mon': 'Mon',
      'login-tue': 'Tue',
      'login-wed': 'Wed',
      'login-thu': 'Thu',
      'login-fri': 'Fri',
      'login-sat': 'Sat',
      'login-sun': 'Sun',
    };
    return dayMap[taskId] || '';
  };

  const weekProgress = weeklyLogin
    ? (weeklyLogin.currentWeekStreak / 7) * 100
    : 0;

  return (
    <div className="home-page-gamified">
      {/* Achievement Banner */}
      {achievementMessage && (
        <div className="achievement-banner">
          {achievementMessage}
        </div>
      )}

      {/* Player Stats Bar */}
      <section className="player-stats-bar">
        <div className="stat-item">
          <span className="stat-label" style={{ color: 'white' }}>⭐ Puanlarım</span>
          <span className="stat-value">{userPoints}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ color: 'white' }}>🔥 Bu Hafta</span>
          <span className="stat-value">{weeklyLogin?.currentWeekStreak || 0}/7</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ color: 'white' }}>👑 En İyi</span>
          <span className="stat-value">{weeklyLogin?.bestWeekStreak || 0}/7</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ color: 'white' }}>📅 Toplam</span>
          <span className="stat-value">{weeklyLogin?.totalLoginDays || 0}</span>
        </div>
      </section>

      {/* Weekly Login Tracker */}
      <section className="weekly-tracker">
        <h2>Haftalık Giriş Takibi</h2>
        <div className="tracker-container">
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card ${task.completed ? 'completed' : ''}`}
              >
                <div className="task-icon">{task.icon}</div>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p className="task-reward">+{task.reward} puan</p>
                </div>
                {task.completed && <div className="check-mark">✓</div>}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-label">
              <span>Hafta İlerlemesi</span>
              <span>{Math.round(weekProgress)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${weekProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="quick-nav">
        <h2>Hızlı Erişim</h2>
        <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '24px' }}>
          Sol menüdeki sekmelerden istediğin bölüme geçebilirsin
        </p>
        <div className="nav-buttons">
          <div className="nav-btn-info">
            💼<br/>İş İlanları
          </div>
          <div className="nav-btn-info">
            👥<br/>Mezunları Ara
          </div>
          <div className="nav-btn-info">
            🗺️<br/>Harita
          </div>
          <div className="nav-btn-info">
            🛍️<br/>Mağaza
          </div>
        </div>
      </section>

      {/* Info Boxes */}
      <section className="info-boxes">
        <div className="info-card">
          <h3>🎮 Nasıl Çalışır?</h3>
          <p>
            Her gün siteyi ziyaret ettiğinde puan kazanırsın. Hafta boyunca her
            gün girildiğinde bonus puan ve başarılar açılır!
          </p>
        </div>
        <div className="info-card">
          <h3>💎 Puanlarını Kullan</h3>
          <p>
            Kazandığın puanları mağazada avatarlara, rozetlere ve madalyalara
            çevirebilirsin. Profilinde göster ve diğerlerini etkilele!
          </p>
        </div>
        <div className="info-card">
          <h3>🏆 Başarılar Aç</h3>
          <p>
            Sürekli giriş yap ve haftaları tamamla. Ne kadar çok oynasan, o
            kadar çok ödül ve başarı açarsın!
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
