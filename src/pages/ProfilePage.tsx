import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  seniority: string; // Junior, Mid, Senior
  location: string;
  companyType: string; // Teknoloji, Finans, İnsan Kaynakları, vb.
  bio: string;
  phone: string;
  linkedin: string;
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
    position: user?.position || '',
    seniority: user?.seniority || 'Junior',
    location: user?.location || '',
    companyType: user?.companyType || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    linkedin: user?.linkedin || '',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // LocalStorage'dan profil verilerini yükle
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, [user?.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // LocalStorage'a kaydet
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(profileData));
    setIsSaved(true);
    setIsEditing(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!user) {
    return <div className="profile-page">Lütfen giriş yapınız.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profilim</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Düzenle
            </button>
          ) : (
            <>
              <button onClick={handleSaveProfile} className="btn-success">
                Kaydet
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">
                İptal
              </button>
            </>
          )}
          <button onClick={logout} className="btn-danger">
            Çıkış Yap
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="success-message">✓ Profil başarıyla kaydedildi!</div>
      )}

      <div className="profile-container">
        {/* Temel Bilgiler */}
        <div className="profile-section">
          <h2>Temel Bilgiler</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Ad *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Adınız"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Soyad *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Soyadınız"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+90 5XX XXX XX XX"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biyografi</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Kendiniz hakkında yazın..."
              rows={4}
            />
          </div>
        </div>

        {/* İş Bilgileri */}
        <div className="profile-section">
          <h2>İş Bilgileri</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Şirket Adı</label>
              <input
                type="text"
                id="company"
                name="company"
                value={profileData.company}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Çalıştığınız şirketin adı"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Pozisyon</label>
              <input
                type="text"
                id="position"
                name="position"
                value={profileData.position}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="İş unvanınız"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seniority">Kıdem Seviyesi</label>
              <select
                id="seniority"
                name="seniority"
                value={profileData.seniority}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Seçiniz...</option>
                <option value="Stajyer">Stajyer</option>
                <option value="Junior">Junior (0-2 yıl)</option>
                <option value="Mid">Mid (2-5 yıl)</option>
                <option value="Senior">Senior (5+ yıl)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="companyType">Şirket Türü</label>
              <select
                id="companyType"
                name="companyType"
                value={profileData.companyType}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Seçiniz...</option>
                <option value="Teknoloji">Teknoloji</option>
                <option value="Finans">Finans</option>
                <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                <option value="Eğitim">Eğitim</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Perakende">Perakende</option>
                <option value="Üretim">Üretim</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasyon</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Şehir, Ülke (örn: İstanbul, Türkiye)"
            />
          </div>
        </div>

        {/* Sosyal Ağlar */}
        <div className="profile-section">
          <h2>Sosyal Ağlar</h2>
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profili</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={profileData.linkedin}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
