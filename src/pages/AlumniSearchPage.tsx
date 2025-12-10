import React, { useState, useMemo, useEffect } from 'react';
import type { UserInventory } from '../types';
import '../styles/AlumniSearch.css';

interface AlumniProfile {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  location: string;
  seniority: string;
  companyType: string;
  bio: string;
  phone: string;
  linkedin: string;
}

// Mock data - gerçek uygulamada backend'den gelir
const MOCK_ALUMNI: AlumniProfile[] = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    company: 'Google',
    position: 'Software Engineer',
    location: 'İstanbul, Türkiye',
    seniority: 'Senior',
    companyType: 'Teknoloji',
    bio: 'Cloud computing ve AI uzmanı',
    phone: '+90 5XX XXX XX XX',
    linkedin: 'https://linkedin.com/in/ahmet',
  },
  {
    id: '2',
    firstName: 'Fatih',
    lastName: 'Demir',
    company: 'Microsoft',
    position: 'Product Manager',
    location: 'Ankara, Türkiye',
    seniority: 'Mid',
    companyType: 'Teknoloji',
    bio: 'Ürün yönetimi ve stratejik planlama',
    phone: '+90 5XX XXX XX XX',
    linkedin: 'https://linkedin.com/in/fatih',
  },
  {
    id: '3',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    company: 'Goldman Sachs',
    position: 'Financial Analyst',
    location: 'New York, USA',
    seniority: 'Junior',
    companyType: 'Finans',
    bio: 'Finansal analiz ve yatırım stratejileri',
    phone: '+1 XXX XXX XXXX',
    linkedin: 'https://linkedin.com/in/ayse',
  },
  {
    id: '4',
    firstName: 'Emre',
    lastName: 'Çelik',
    company: 'SAP',
    position: 'IT Consultant',
    location: 'Berlin, Almanya',
    seniority: 'Senior',
    companyType: 'Teknoloji',
    bio: 'Kurumsal yazılım çözümleri',
    phone: '+49 XXX XXXXXXX',
    linkedin: 'https://linkedin.com/in/emre',
  },
  {
    id: '5',
    firstName: 'Zeynep',
    lastName: 'Aksoy',
    company: 'Akbank',
    position: 'HR Manager',
    location: 'İstanbul, Türkiye',
    seniority: 'Mid',
    companyType: 'Finans',
    bio: 'İnsan kaynakları yönetimi',
    phone: '+90 5XX XXX XX XX',
    linkedin: 'https://linkedin.com/in/zeynep',
  },
];

export const AlumniSearchPage: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('');
  const [selectedSeniority, setSelectedSeniority] = useState('');
  const [inventories, setInventories] = useState<{ [key: string]: UserInventory }>({});

  // Avatarları yükle
  useEffect(() => {
    const newInventories: { [key: string]: UserInventory } = {};
    MOCK_ALUMNI.forEach(alumni => {
      const stored = localStorage.getItem(`inventory-${alumni.id}`);
      if (stored) {
        try {
          newInventories[alumni.id] = JSON.parse(stored);
        } catch {
          newInventories[alumni.id] = {
            userId: alumni.id,
            avatars: [],
            badges: [],
            medals: [],
            selectedAvatar: '👤',
            selectedBadges: [],
          };
        }
      }
    });
    setInventories(newInventories);
  }, []);

  // Filtreleme mantığı
  const filteredAlumni = useMemo(() => {
    return MOCK_ALUMNI.filter(alumni => {
      const fullName = `${alumni.firstName} ${alumni.lastName}`.toLowerCase();
      const nameMatch =
        !searchName || fullName.includes(searchName.toLowerCase());

      const companyMatch =
        !searchCompany ||
        alumni.company.toLowerCase().includes(searchCompany.toLowerCase());

      const locationMatch =
        !searchLocation ||
        alumni.location.toLowerCase().includes(searchLocation.toLowerCase());

      const companyTypeMatch =
        !selectedCompanyType || alumni.companyType === selectedCompanyType;

      const seniorityMatch =
        !selectedSeniority || alumni.seniority === selectedSeniority;

      return (
        nameMatch &&
        companyMatch &&
        locationMatch &&
        companyTypeMatch &&
        seniorityMatch
      );
    });
  }, [searchName, searchCompany, searchLocation, selectedCompanyType, selectedSeniority]);

  const handleReset = () => {
    setSearchName('');
    setSearchCompany('');
    setSearchLocation('');
    setSelectedCompanyType('');
    setSelectedSeniority('');
  };

  const getInventory = (id: string): UserInventory => {
    return inventories[id] || {
      userId: id,
      avatars: [],
      badges: [],
      medals: [],
      selectedAvatar: '👤',
      selectedBadges: [],
    };
  };

  return (
    <div className="alumni-search-page">
      <div className="alumni-header">
        <h1>Başkent Mezunları Ara</h1>
        <p>Başkent Üniversitesi mezunlarını bulun ve iletişime geçin</p>
      </div>

      {/* Filtreleme Panel */}
      <div className="filter-panel">
        <h2>Filtreler</h2>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="search-name">Ad/Soyad Ara</label>
            <input
              type="text"
              id="search-name"
              placeholder="İsim veya soyisim..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="search-company">Şirket Ara</label>
            <input
              type="text"
              id="search-company"
              placeholder="Şirket adı..."
              value={searchCompany}
              onChange={e => setSearchCompany(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="search-location">Lokasyon</label>
            <input
              type="text"
              id="search-location"
              placeholder="Şehir, ülke..."
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="company-type">Şirket Türü</label>
            <select
              id="company-type"
              value={selectedCompanyType}
              onChange={e => setSelectedCompanyType(e.target.value)}
            >
              <option value="">Tümü</option>
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

          <div className="filter-group">
            <label htmlFor="seniority">Kıdem Seviyesi</label>
            <select
              id="seniority"
              value={selectedSeniority}
              onChange={e => setSelectedSeniority(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="Stajyer">Stajyer</option>
              <option value="Junior">Junior (0-2 yıl)</option>
              <option value="Mid">Mid (2-5 yıl)</option>
              <option value="Senior">Senior (5+ yıl)</option>
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={handleReset} className="btn-reset">
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Arama Sonuçları */}
      <div className="results-section">
        <h2>Sonuçlar ({filteredAlumni.length})</h2>

        {filteredAlumni.length === 0 ? (
          <div className="no-results">
            <p>Arama kriterlerine uygun mezun bulunamadı.</p>
            <button onClick={handleReset} className="btn-primary">
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="alumni-grid">
            {filteredAlumni.map(alumni => {
              const inv = getInventory(alumni.id);
              return (
                <div key={alumni.id} className="alumni-card">
                  <div className="card-header">
                    <div className="avatar-section">
                      <div className="avatar large">
                        {inv.selectedAvatar || '👤'}
                      </div>
                      {inv.selectedBadges.length > 0 && (
                        <div className="badges-display">
                          {inv.selectedBadges.slice(0, 3).map((badgeId, idx) => {
                            const badgeEmojis: { [key: string]: string } = {
                              'badge-1': '🎯',
                              'badge-2': '⭐',
                              'badge-3': '🦋',
                              'badge-4': '🎯',
                              'badge-5': '🧠',
                            };
                            return (
                              <span key={idx} className="badge-emoji">
                                {badgeEmojis[badgeId] || '⭐'}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="card-title-section">
                      <h3>{alumni.firstName} {alumni.lastName}</h3>
                      <p className="position">{alumni.position}</p>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Şirket:</span>
                      <span className="value">{alumni.company}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Lokasyon:</span>
                      <span className="value">{alumni.location}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Şirket Türü:</span>
                      <span className="value badge">{alumni.companyType}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Kıdem:</span>
                      <span className="value badge">{alumni.seniority}</span>
                    </div>

                    {alumni.bio && (
                      <div className="bio">
                        <p>{alumni.bio}</p>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    {alumni.linkedin && (
                      <a
                        href={alumni.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link"
                      >
                        LinkedIn Profili
                      </a>
                    )}
                    {alumni.phone && (
                      <span className="phone">📞 {alumni.phone}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
