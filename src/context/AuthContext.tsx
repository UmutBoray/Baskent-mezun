import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  isAdmin?: boolean;
}

export interface AlumniProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  workplace?: string;
  location?: string;
  sector?: string;
  seniority?: string;
  position?: string;
  points: number;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  profile: AlumniProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<AlumniProfile | null>;
  updateProfile: (updates: Partial<AlumniProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Sayfa yüklendiğinde localStorage'dan kontrol et
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // API'den profili çek
      fetchProfile(storedToken);
    }
    setIsLoading(false);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { user: userData, token } = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      await fetchProfile(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { user: userData, token } = response.data;
      
      console.log('📊 Admin login response:', userData);
      console.log('📊 isAdmin from backend:', userData.isAdmin);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', 'true');
      
      await fetchProfile(token);
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      const { user: userData, token } = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      await fetchProfile(token);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  };

  const updateProfile = async (updates: Partial<AlumniProfile>) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    try {
      setIsLoading(true);
      const response = await axios.patch(`${API_URL}/api/users/profile`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        getProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

