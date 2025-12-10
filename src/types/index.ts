// Kullanıcı tipleri
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isLoggedIn: boolean;
  isAdmin?: boolean; // Admin flag
  // İş bilgileri
  company?: string;
  position?: string;
  seniority?: 'Stajyer' | 'Junior' | 'Mid' | 'Senior';
  location?: string;
  companyType?: string;
  bio?: string;
  phone?: string;
  linkedin?: string;
  // Puan ve Rozet Sistemi
  points?: number; // Sistem puanı
  badges?: string[]; // Rozet ID'leri
  avatar?: string; // Avatar ID'si
  weeklyLoginDates?: string[]; // Haftalık giriş tarihleri
}

// Profil bilgileri
export interface AlumniProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  company: string;
  position: string;
  seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director' | 'C-Level';
  city: string;
  country: string;
  bio?: string;
  skills?: string[];
  graduationYear?: number;
  department?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// İş ilanı
export interface JobPosting {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  company: string;
  position: string;
  city: string;
  country: string;
  seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Manager';
  jobType: 'Full-time' | 'Part-time' | 'Freelance' | 'Contract';
  salary?: string;
  requirements?: string[];
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Filtreleme özellikleri
export interface FilterOptions {
  searchQuery?: string;
  company?: string;
  position?: string;
  city?: string;
  country?: string;
  seniority?: string;
  skills?: string[];
  department?: string;
  minYear?: number;
  maxYear?: number;
}

// Harita için lokasyon verileri
export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lng: number;
  alumniCount: number;
  alumni: AlumniProfile[];
}

// Duyuru
export interface Announcement {
  id: string;
  title: string;
  content: string;
  description?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  category?: 'General' | 'Event' | 'Job' | 'Important' | 'Announcement';
}

// Sistem Log
export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'create_job' | 'delete_job' | 'create_announcement' | 'delete_announcement' | 'update_profile';
  description: string;
  timestamp: string;
  ipAddress?: string;
  status: 'success' | 'error';
}

// Admin İstatistikleri
export interface AdminStats {
  totalUsers: number;
  totalAlumni: number;
  totalJobPostings: number;
  totalAnnouncements: number;
  activeUsers: number;
  logsCount: number;
}

// Görev Sistemi
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  completed: boolean;
  reward: number; // puan
  completedDate?: string;
}

// Haftalık Giriş Takibi
export interface WeeklyLogin {
  userId: string;
  loginDates: string[]; // YYYY-MM-DD formatında
  currentWeekStreak: number;
  bestWeekStreak: number;
  totalLoginDays: number;
}

// Mağaza Ürünü
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'badge' | 'medal'; // avatar, rozet, madalya
  icon: string; // emoji veya URL
  price: number; // puan maliyeti
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Kullanıcının Sahip Olduğu Ürünler
export interface UserInventory {
  userId: string;
  avatars: string[]; // avatar ID'leri
  badges: string[]; // rozet ID'leri
  medals: string[]; // madalya ID'leri
  selectedAvatar: string; // aktif avatar
  selectedBadges: string[]; // gösterilen rozetler (max 3)
}
