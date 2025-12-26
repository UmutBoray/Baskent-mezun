import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapPage.css";

const mapCenter: LatLngExpression = [39.9334, 32.8597];

interface CityData {
  city: string;
  country: string;
  alumni: number;
  coordinates: { lat: number; lng: number };
  description: string;
}

const CITIES_WITH_ALUMNI: CityData[] = [
  {
    city: "İstanbul",
    country: "Türkiye",
    alumni: 45,
    coordinates: { lat: 41.0082, lng: 28.9784 },
    description: "Teknoloji, Finans, Medya",
  },
  {
    city: "Ankara",
    country: "Türkiye",
    alumni: 28,
    coordinates: { lat: 39.9334, lng: 32.8597 },
    description: "Kamu, Teknoloji",
  },
  {
    city: "İzmir",
    country: "Türkiye",
    alumni: 15,
    coordinates: { lat: 38.4161, lng: 27.1228 },
    description: "Ticaret, İthalatçılık",
  },
  {
    city: "San Francisco",
    country: "USA",
    alumni: 12,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    description: "Teknoloji, Startuplar",
  },
  {
    city: "New York",
    country: "USA",
    alumni: 18,
    coordinates: { lat: 40.7128, lng: -74.006 },
    description: "Finans, Medya",
  },
  {
    city: "London",
    country: "UK",
    alumni: 22,
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: "Finans, Danışmanlık",
  },
  {
    city: "Berlin",
    country: "Almanya",
    alumni: 14,
    coordinates: { lat: 52.52, lng: 13.405 },
    description: "Teknoloji, Startup",
  },
  {
    city: "Dubai",
    country: "BAE",
    alumni: 11,
    coordinates: { lat: 25.2048, lng: 55.2708 },
    description: "Finans, İnşaat",
  },
];

const customIcon = new Icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const MapPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  const totalAlumni = CITIES_WITH_ALUMNI.reduce(
    (sum, city) => sum + city.alumni,
    0,
  );

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Başkent Mezunları Dünya Haritası</h1>
        <p>Başkent Üniversitesi mezunlarının çalıştığı şehirler</p>
        <div className="stats">
          <span>Toplam Mezun: {totalAlumni}</span>
          <span>
            Ülke Sayısı:{" "}
            {new Set(CITIES_WITH_ALUMNI.map((c) => c.country)).size}
          </span>
          <span>Şehir Sayısı: {CITIES_WITH_ALUMNI.length}</span>
        </div>
      </div>

      <div className="map-container">
        <div className="leaflet-map-wrapper">
          <MapContainer
            center={mapCenter}
            zoom={5}
            minZoom={3}
            className="leaflet-container"
            scrollWheelZoom={true}
            worldCopyJump={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {CITIES_WITH_ALUMNI.map((city) => {
              const position: LatLngExpression = [
                city.coordinates.lat,
                city.coordinates.lng,
              ];
              return (
                <Marker
                  key={city.city}
                  position={position}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedCity(city),
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>
                        {city.city}, {city.country}
                      </h3>
                      <p>
                        <strong>{city.alumni}</strong> mezun
                      </p>
                      <p>{city.description}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div className="city-details-panel">
          <h2>Şehir Listesi</h2>

          {selectedCity && (
            <div className="selected-city-info">
              <h3>
                {selectedCity.city}, {selectedCity.country}
              </h3>
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
              (city) => (
                <div
                  key={city.city}
                  className={`city-item ${
                    selectedCity?.city === city.city ? "active" : ""
                  }`}
                  onClick={() => setSelectedCity(city)}
                >
                  <div className="city-info">
                    <h4>{city.city}</h4>
                    <p className="country">{city.country}</p>
                  </div>
                  <div className="alumni-badge">{city.alumni}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
