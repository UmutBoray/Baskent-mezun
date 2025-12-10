import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AlumniProfile, SystemLog } from '../types';

interface AuthContextType {
  user: User | null;
  profile: AlumniProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  updateProfile: (profile: AlumniProfile) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  addLog: (action: string, description: string, status: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sayfa yüklendiğinde localStorage'dan kontrol et
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profile');
    const storedAnnouncements = localStorage.getItem('announcements');
    
    // İlk kez yükleniyorsa örnek duyurular ekle
    if (!storedAnnouncements) {
      const sampleAnnouncements = [
        {
          id: '1',
          title: 'Başkent Mezunları Ağı Açıldı!',
          content: 'Başkent Üniversitesi mezunları için özel bir ağ platformu açıldı. Burada mezunlar birbirlerine ulaşabilir, iş fırsatları paylaşabilir ve networking yapabilirler.',
          description: 'Platform başarıyla açılmıştır.',
          category: 'Announcement',
          authorId: 'admin-1',
          authorName: 'Yönetim',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isPinned: true,
        },
        {
          id: '2',
          title: 'Girişimcilik Seminerı - 25 Kasım',
          content: 'Başkent Üniversitesi Girişimcilik Merkezi tarafından düzenlenecek semineriye davet ediyoruz. Başarılı girişimciler deneyimlerini paylaşacaklardır.',
          description: 'Girişimcilik ve iş geliştirme hakkında interaktif seminer',
          category: 'Event',
          authorId: 'admin-1',
          authorName: 'Yönetim',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isPinned: true,
        },
        {
          id: '3',
          title: 'Mentoring Programı Başladı',
          content: 'Deneyimli mezunlarımız yeni mezunlara rehberlik etmek için gönüllü olarak program başlamıştır. İlgilenenler lütfen başvurunuzu yapınız.',
          description: 'Başarılı mezunlarla mentoring seansları',
          category: 'Announcement',
          authorId: 'admin-1',
          authorName: 'Yönetim',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isPinned: false,
        },
      ];
      localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
    }
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      // TODO: API çağrısı yapılacak
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Test',
        lastName: 'User',
        isLoggedIn: true,
        isAdmin: false,
        points: 0,
        avatar: '👤',
        badges: [],
        weeklyLoginDates: [],
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      addLog('login', `Kullanıcı giriş yaptı: ${email}`, 'success');
    } catch (error) {
      console.error('Login hatası:', error);
      addLog('login', `Giriş başarısız: ${email}`, 'error');
      throw error;
    }
  };

  const adminLogin = async (email: string, _password: string) => {
    try {
      // Demo admin kontrolü
      if (email === 'admin@baskent.edu.tr' && _password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email,
          firstName: 'Admin',
          lastName: 'User',
          isLoggedIn: true,
          isAdmin: true,
          points: 0,
          avatar: '👤',
          badges: [],
          weeklyLoginDates: [],
        };
        
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        addLog('login', `Admin giriş yaptı: ${email}`, 'success');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      addLog('login', `Admin giriş başarısız: ${email}`, 'error');
      throw error;
    }
  };

  const logout = () => {
    if (user) {
      addLog('logout', `Kullanıcı çıkış yaptı: ${user.email}`, 'success');
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  const register = async (email: string, _password: string, firstName: string, lastName: string) => {
    try {
      // TODO: API çağrısı yapılacak
      const newUser: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        isLoggedIn: true,
        isAdmin: false,
        points: 0,
        avatar: '👤',
        badges: [],
        weeklyLoginDates: [],
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      addLog('register', `Yeni kullanıcı kayıt oldu: ${email}`, 'success');
    } catch (error) {
      console.error('Register hatası:', error);
      addLog('register', `Kayıt başarısız: ${email}`, 'error');
      throw error;
    }
  };

  const updateProfile = async (newProfile: AlumniProfile) => {
    try {
      // TODO: API çağrısı yapılacak
      setProfile(newProfile);
      localStorage.setItem('profile', JSON.stringify(newProfile));
      addLog('update_profile', `Profil güncellendi: ${user?.email}`, 'success');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      addLog('update_profile', `Profil güncelleme başarısız: ${user?.email}`, 'error');
      throw error;
    }
  };

  const addLog = (action: string, description: string, status: 'success' | 'error') => {
    const log: SystemLog = {
      id: Date.now().toString(),
      userId: user?.id || 'unknown',
      userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      action: action as any,
      description,
      timestamp: new Date().toISOString(),
      status,
    };

    // LocalStorage'a log ekle
    const existingLogs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
    existingLogs.push(log);
    // Son 100 logu tut
    if (existingLogs.length > 100) {
      existingLogs.shift();
    }
    localStorage.setItem('systemLogs', JSON.stringify(existingLogs));
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    adminLogin,
    addLog,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }
  return context;
};

