import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { ShopItem, UserInventory } from '../types';
import '../styles/Shop.css';

const ShopPage: React.FC = () => {
  const { user } = useAuth();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userInventory, setUserInventory] = useState<UserInventory | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [filter, setFilter] = useState<'all' | 'avatar' | 'badge' | 'medal'>('all');
  const [purchaseMessage, setPurchaseMessage] = useState('');

  // Mağaza ürünleri
  const SHOP_ITEMS: ShopItem[] = [
    // Avatarlar
    {
      id: 'avatar-1',
      name: 'Mavi Ceket',
      description: 'Mavi renkte şık ceket',
      type: 'avatar',
      icon: '👨‍💼',
      price: 50,
      rarity: 'common',
    },
    {
      id: 'avatar-2',
      name: 'Gözlüklü Geek',
      description: 'Teknoloji tutkunları için',
      type: 'avatar',
      icon: '🤓',
      price: 75,
      rarity: 'rare',
    },
    {
      id: 'avatar-3',
      name: 'Astronot',
      description: 'Uzayın sınırını aşan',
      type: 'avatar',
      icon: '👨‍🚀',
      price: 150,
      rarity: 'epic',
    },
    {
      id: 'avatar-4',
      name: 'Korsan Kaptan',
      description: 'Tehlikeli ve gizemli',
      type: 'avatar',
      icon: '🏴‍☠️',
      price: 200,
      rarity: 'legendary',
    },
    // Rozetler
    {
      id: 'badge-1',
      name: 'İlk Giriş',
      description: 'İlk günün kutlaması',
      type: 'badge',
      icon: '🎯',
      price: 25,
      rarity: 'common',
    },
    {
      id: 'badge-2',
      name: 'Haftanın Lideri',
      description: '7 gün üst üste giriş',
      type: 'badge',
      icon: '⭐',
      price: 75,
      rarity: 'rare',
    },
    {
      id: 'badge-3',
      name: 'Sosyal Kelebek',
      description: 'Mezunlar ile bağlantı kur',
      type: 'badge',
      icon: '🦋',
      price: 100,
      rarity: 'rare',
    },
    {
      id: 'badge-4',
      name: 'İş Avcısı',
      description: '5 iş ilanı yayınla',
      type: 'badge',
      icon: '🎯',
      price: 125,
      rarity: 'epic',
    },
    {
      id: 'badge-5',
      name: 'Danışman Pro',
      description: '10 profil ziyareti',
      type: 'badge',
      icon: '🧠',
      price: 150,
      rarity: 'epic',
    },
    // Madalyalar
    {
      id: 'medal-1',
      name: 'Bronz Madalya',
      description: '30 puan kazandı',
      type: 'medal',
      icon: '🥉',
      price: 200,
      rarity: 'common',
    },
    {
      id: 'medal-2',
      name: 'Gümüş Madalya',
      description: '100 puan kazandı',
      type: 'medal',
      icon: '🥈',
      price: 300,
      rarity: 'rare',
    },
    {
      id: 'medal-3',
      name: 'Altın Madalya',
      description: 'Efsane başarılar',
      type: 'medal',
      icon: '🥇',
      price: 500,
      rarity: 'epic',
    },
    {
      id: 'medal-4',
      name: 'Elmas Madalya',
      description: 'Harita tarihinde en iyi',
      type: 'medal',
      icon: '💎',
      price: 1000,
      rarity: 'legendary',
    },
  ];

  useEffect(() => {
    setShopItems(SHOP_ITEMS);

    // Envanter yükle
    if (user) {
      const storedInventory = localStorage.getItem(`inventory-${user.id}`);
      if (storedInventory) {
        setUserInventory(JSON.parse(storedInventory));
      } else {
        const newInventory: UserInventory = {
          userId: user.id,
          avatars: [],
          badges: [],
          medals: [],
          selectedAvatar: '👤',
          selectedBadges: [],
        };
        setUserInventory(newInventory);
        localStorage.setItem(`inventory-${user.id}`, JSON.stringify(newInventory));
      }

      // Puanları yükle
      setUserPoints(user.points || 0);
    }
  }, [user]);

  const handlePurchase = (item: ShopItem) => {
    if (!user || !userInventory) return;

    if (userPoints < item.price) {
      setPurchaseMessage('❌ Yetersiz puan!');
      setTimeout(() => setPurchaseMessage(''), 3000);
      return;
    }

    // Zaten sahip mi kontrol et
    const alreadyOwned =
      (item.type === 'avatar' && userInventory.avatars.includes(item.id)) ||
      (item.type === 'badge' && userInventory.badges.includes(item.id)) ||
      (item.type === 'medal' && userInventory.medals.includes(item.id));

    if (alreadyOwned) {
      setPurchaseMessage('✓ Zaten sahipsin!');
      setTimeout(() => setPurchaseMessage(''), 3000);
      return;
    }

    // Satın al
    const updatedInventory = { ...userInventory };
    if (item.type === 'avatar') {
      updatedInventory.avatars.push(item.id);
    } else if (item.type === 'badge') {
      updatedInventory.badges.push(item.id);
      // Max 3 rozet göster
      if (updatedInventory.selectedBadges.length < 3) {
        updatedInventory.selectedBadges.push(item.id);
      }
    } else if (item.type === 'medal') {
      updatedInventory.medals.push(item.id);
    }

    setUserInventory(updatedInventory);
    localStorage.setItem(`inventory-${user.id}`, JSON.stringify(updatedInventory));

    // Puanları güncelle
    const newPoints = userPoints - item.price;
    setUserPoints(newPoints);

    // User localStorage'da güncelle
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.map((u: any) =>
      u.id === user.id ? { ...u, points: newPoints } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setPurchaseMessage(`✅ ${item.name} satın alındı! -${item.price} puan`);
    setTimeout(() => setPurchaseMessage(''), 4000);
  };

  const filteredItems =
    filter === 'all' ? shopItems : shopItems.filter((item) => item.type === filter);

  const isOwned = (item: ShopItem): boolean => {
    if (!userInventory) return false;
    if (item.type === 'avatar') return userInventory.avatars.includes(item.id);
    if (item.type === 'badge') return userInventory.badges.includes(item.id);
    if (item.type === 'medal') return userInventory.medals.includes(item.id);
    return false;
  };

  const getRarityColor = (rarity: string): string => {
    const colors: { [key: string]: string } = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b',
    };
    return colors[rarity] || '#6b7280';
  };

  const getRarityLabel = (rarity: string): string => {
    const labels: { [key: string]: string } = {
      common: 'Yaygın',
      rare: 'Nadir',
      epic: 'Epik',
      legendary: 'Efsanevi',
    };
    return labels[rarity] || rarity;
  };

  return (
    <div className="shop-page">
      {/* Purchase Message */}
      {purchaseMessage && <div className="shop-message">{purchaseMessage}</div>}

      {/* Header */}
      <div className="shop-header">
        <h1>🛍️ Mağaza</h1>
        <div className="points-display">
          <span className="points-label">⭐ Puanlarım:</span>
          <span className="points-value">{userPoints}</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tümü
        </button>
        <button
          className={`filter-btn ${filter === 'avatar' ? 'active' : ''}`}
          onClick={() => setFilter('avatar')}
        >
          👤 Avatarlar
        </button>
        <button
          className={`filter-btn ${filter === 'badge' ? 'active' : ''}`}
          onClick={() => setFilter('badge')}
        >
          ⭐ Rozetler
        </button>
        <button
          className={`filter-btn ${filter === 'medal' ? 'active' : ''}`}
          onClick={() => setFilter('medal')}
        >
          🥇 Madalyalar
        </button>
      </div>

      {/* Shop Items Grid */}
      <div className="shop-grid">
        {filteredItems.map((item) => {
          const owned = isOwned(item);
          return (
            <div
              key={item.id}
              className={`shop-card ${owned ? 'owned' : ''}`}
              style={{
                borderTopColor: getRarityColor(item.rarity),
              }}
            >
              <div className="shop-card-header">
                <div className="item-icon">{item.icon}</div>
                <span
                  className="rarity-badge"
                  style={{ backgroundColor: getRarityColor(item.rarity) }}
                >
                  {getRarityLabel(item.rarity)}
                </span>
              </div>

              <div className="shop-card-content">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>

                <div className="item-type">
                  {item.type === 'avatar' && '👤 Avatar'}
                  {item.type === 'badge' && '⭐ Rozet'}
                  {item.type === 'medal' && '🥇 Madalya'}
                </div>
              </div>

              <div className="shop-card-footer">
                {owned ? (
                  <div className="owned-badge">✓ Sahip Olduğun</div>
                ) : (
                  <>
                    <span className="price">
                      {item.price} <span className="price-icon">⭐</span>
                    </span>
                    <button
                      className="buy-btn"
                      onClick={() => handlePurchase(item)}
                      disabled={userPoints < item.price}
                    >
                      Satın Al
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="shop-info">
        <div className="info-box">
          <h3>💡 Nasıl Kullanırım?</h3>
          <p>
            Puanlarınız ile mağazadan avatar, rozet ve madalya satın alabilirsiniz.
            Satın aldığınız avatarları profilinizde gösterebilir, rozetlerinizi
            sergileyebilirsiniz!
          </p>
        </div>
        <div className="info-box">
          <h3>🎯 Puan Kazan</h3>
          <p>
            Hafta boyunca her gün siteyi ziyaret ederek puan kazanın. Hafta
            tamamlandığında bonus puanlar ve başarılar açılır. Her ne kadar çok
            oynasan, o kadar çok puan ve ödül!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
