import React, { useState } from 'react';
import '../styles/MapPage.css';

interface CityData {
  city: string;
  country: string;
  alumni: number;
  coordinates: { lat: number; lng: number };
  description: string;
}

// Başkent mezunlarının çalıştığı şehirler (mock data)
const CITIES_WITH_ALUMNI: CityData[] = [
  {
    city: 'İstanbul',
    country: 'Türkiye',
    alumni: 45,
    coordinates: { lat: 41.0082, lng: 28.9784 },
    description: 'Teknoloji, Finans, Medya',
  },
  {
    city: 'Ankara',
    country: 'Türkiye',
    alumni: 28,
    coordinates: { lat: 39.9334, lng: 32.8597 },
    description: 'Kamu, Teknoloji',
  },
  {
    city: 'İzmir',
    country: 'Türkiye',
    alumni: 15,
    coordinates: { lat: 38.4161, lng: 27.1228 },
    description: 'Ticaret, İthalatçılık',
  },
  {
    city: 'San Francisco',
    country: 'USA',
    alumni: 12,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    description: 'Teknoloji, Startuplar',
  },
  {
    city: 'New York',
    country: 'USA',
    alumni: 18,
    coordinates: { lat: 40.7128, lng: -74.006 },
    description: 'Finans, Medya',
  },
  {
    city: 'London',
    country: 'UK',
    alumni: 22,
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: 'Finans, Danışmanlık',
  },
  {
    city: 'Berlin',
    country: 'Almanya',
    alumni: 14,
    coordinates: { lat: 52.52, lng: 13.405 },
    description: 'Teknoloji, Startup',
  },
  {
    city: 'Dubai',
    country: 'BAE',
    alumni: 11,
    coordinates: { lat: 25.2048, lng: 55.2708 },
    description: 'Finans, İnşaat',
  },
];

export const MapPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  // Basit 2D projeksiyon - enlemi ve boylamı ekrana dönüştür
  const projectCoordinates = (lat: number, lng: number) => {
    // Dünya haritasının genişliği ve yüksekliği
    const mapWidth = 1200;
    const mapHeight = 600;

    // Mercator projeksiyonu yaklaşımı
    const x = ((lng + 180) / 360) * mapWidth;
    const y =
      ((180 - Math.asin(Math.sin((lat * Math.PI) / 180)) * Math.cos(0)) * 180) /
      Math.PI;
    const yNormalized = ((y + 90) / 180) * mapHeight;

    return { x, y: yNormalized };
  };

  const totalAlumni = CITIES_WITH_ALUMNI.reduce((sum, city) => sum + city.alumni, 0);

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Başkent Mezunları Dünya Haritası</h1>
        <p>Başkent Üniversitesi mezunlarının çalıştığı şehirler</p>
        <div className="stats">
          <span>Toplam Mezun: {totalAlumni}</span>
          <span>Ülke Sayısı: {new Set(CITIES_WITH_ALUMNI.map(c => c.country)).size}</span>
          <span>Şehir Sayısı: {CITIES_WITH_ALUMNI.length}</span>
        </div>
      </div>

      <div className="map-container">
        {/* Placeholder Harita */}
        <div className="map-placeholder">
          <svg
            width="1200"
            height="600"
            viewBox="0 0 1200 600"
            className="world-map"
          >
            {/* Dünya haritası arka planı - basit grid */}
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="1200" height="600" fill="url(#grid)" />

            {/* Harita çerçevesi */}
            <rect
              width="1200"
              height="600"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            />

            {/* Meridyen ve paralelller */}
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150].map(lng => (
              <line
                key={`lng-${lng}`}
                x1={((lng + 180) / 360) * 1200}
                y1="0"
                x2={((lng + 180) / 360) * 1200}
                y2="600"
                stroke="#f0f0f0"
                strokeWidth="0.5"
              />
            ))}

            {[0, 20, 40, 60].map(lat => {
              const y =
                ((180 -
                  Math.asin(Math.sin((lat * Math.PI) / 180)) *
                    Math.cos(0)) *
                  180) /
                Math.PI;
              const yNormalized = ((y + 90) / 180) * 600;
              return (
                <line
                  key={`lat-${lat}`}
                  x1="0"
                  y1={yNormalized}
                  x2="1200"
                  y2={yNormalized}
                  stroke="#f0f0f0"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Şehir işaretleyicileri */}
            {CITIES_WITH_ALUMNI.map(city => {
              const { x, y } = projectCoordinates(
                city.coordinates.lat,
                city.coordinates.lng
              );
              const isSelected = selectedCity?.city === city.city;

              return (
                <g key={city.city}>
                  {/* Işık halkası */}
                  <circle
                    cx={x}
                    cy={y}
                    r={city.alumni / 2}
                    fill="rgba(59, 130, 246, 0.1)"
                  />

                  {/* Ana noktası */}
                  <circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill={isSelected ? '#dc2626' : '#3b82f6'}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                    onClick={() => setSelectedCity(city)}
                  />

                  {/* Şehir etiketi */}
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#333"
                    className="city-label"
                  >
                    {city.city}
                  </text>

                  {/* Mezun sayısı */}
                  <text
                    x={x}
                    y={y + 25}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#666"
                    className="alumni-count"
                  >
                    {city.alumni} mezun
                  </text>
                </g>
              );
            })}

            {/* Harita notası */}
            <text
              x="600"
              y="30"
              textAnchor="middle"
              fontSize="14"
              fill="#666"
              fontStyle="italic"
            >
              * Google Maps API entegrasyonu için placeholder harita
            </text>
          </svg>
        </div>

        {/* Şehir Detayları Paneli */}
        <div className="city-details-panel">
          <h2>Şehir Listesi</h2>

          {selectedCity && (
            <div className="selected-city-info">
              <h3>{selectedCity.city}, {selectedCity.country}</h3>
              <div className="detail-row">
                <span className="label">Mezun Sayısı:</span>
                <span className="value badge">{selectedCity.alumni}</span>
              </div>
              <div className="detail-row">
                <span className="label">Sektörler:</span>
                <span className="value">{selectedCity.description}</span>
              </div>
              <p className="description">
                Başkent Üniversitesi'nden {selectedCity.alumni} mezun,
                {selectedCity.city}'de çeşitli alanlarda çalışmaktadır.
              </p>
              <button
                className="btn-close"
                onClick={() => setSelectedCity(null)}
              >
                Kapat
              </button>
            </div>
          )}

          <div className="cities-list">
            {CITIES_WITH_ALUMNI.sort((a, b) => b.alumni - a.alumni).map(
              city => (
                <div
                  key={city.city}
                  className={`city-item ${
                    selectedCity?.city === city.city ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCity(city)}
                >
                  <div className="city-info">
                    <h4>{city.city}</h4>
                    <p className="country">{city.country}</p>
                  </div>
                  <div className="alumni-badge">
                    {city.alumni}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Google Maps API Uyarısı */}
      <div className="api-note">
        <p>
          <strong>Not:</strong> Bu harita placeholder'dır. Gerçek harita için Google Maps API entegrasyonu yapılacaktır.
          API anahtarınızı environment değişkenlerine ekledikten sonra, InteractiveMap bileşeni yerinde kullanılacaktır.
        </p>
      </div>
    </div>
  );
};
