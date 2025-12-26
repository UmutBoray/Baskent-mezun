# Başkent Mezunlar Platformu - Full Stack

Frontend (React + Vite + TypeScript) ve Backend (Node.js + Express + TypeScript) with Leaflet Maps.

## Proje Yapısı

```
baskent-mezun/
├── src/                    # Frontend (React)
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── main.tsx
├── backend/               # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── types/
│   │   ├── data/
│   │   └── index.ts
│   └── package.json
├── package.json           # Frontend dependencies
└── README.md
```

## Hızlı Başlangıç

### 1. Frontend Kurulumu

```bash
npm install
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:5173`

### 2. Backend Kurulumu

```bash
cd backend
npm install
npm run dev
```

Backend şu adreste çalışacak: `http://localhost:5000`

## Özellikler

### Şu Anda Hazır
- ✅ React + TypeScript Frontend
- ✅ Leaflet Maps Entegrasyonu
- ✅ İnteraktif Dünya Haritası
- ✅ Şehir Listesi ve Detayları
- ✅ Node.js + Express Backend
- ✅ Mock Data ile API Endpoints
- ✅ CORS Yapılandırması
- ✅ TypeScript Backend

### Yakında Eklenecek
- [ ] PostgreSQL Veritabanı Entegrasyonu
- [ ] Kullanıcı Yönetimi & Kimlik Doğrulama (JWT)
- [ ] Alumni Arama ve Filtreleme
- [ ] AI/LLM Entegrasyonu
- [ ] Admin Paneli
- [ ] Dosya Yükleme (Profil Resmi)
- [ ] Email Gönderimi
- [ ] Notification System

## API Endpoints

### Sağlık Kontrol
- `GET /api/health` - Sunucu durumu kontrol

### Şehirler (Cities)
- `GET /api/cities` - Tüm şehirleri getir
- `GET /api/cities/stats` - Şehir istatistikleri
- `GET /api/cities/search?query=istanbul` - Şehir ara
- `GET /api/cities/:id` - Belirli şehri getir

### Alumni
- `GET /api/alumni` - Tüm alumni'leri getir
- `GET /api/alumni/stats` - Alumni istatistikleri
- `GET /api/alumni/search?city=istanbul` - Alumni ara
- `GET /api/alumni/:id` - Belirli alumni'yi getir

## Ortam Değişkenleri

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (backend/.env)
```
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

## Teknolojiler

### Frontend
- React 19.2
- TypeScript 5.9
- Vite (Build Tool)
- React Router 7.9
- Axios (HTTP Client)
- Leaflet (Maps)
- React Leaflet 5.0
- Recharts (Charts)
- React Icons

### Backend
- Node.js
- Express.js 4.18
- TypeScript 5.3
- CORS
- UUID (Unique IDs)

## Geliştirme

### Backend'i Run Etmek
```bash
cd backend
npm run dev
```

### Frontend'i Run Etmek
```bash
npm run dev
```

### Build Etmek
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

## Dosya Yükleme Seçenekleri

Backend şu anda şunları desteklemektedir:
- Query parameters ile arama
- Filter based alumni listing
- Statistics endpoints

Dosya yükleme ve daha ileri özellikler yakında eklenecektir.

## Notlar

- Veritabanı şimdilik Mock Data kullanıyor
- PostgreSQL entegrasyonu sonraki aşamada yapılacak
- AI/LLM API integration daha sonra konfigüre edilecek

## Lisans

MIT
