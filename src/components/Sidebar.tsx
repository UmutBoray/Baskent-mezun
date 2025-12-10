import React from 'react';
import { FaBriefcase, FaUsers, FaUser, FaMap, FaHome, FaShoppingCart } from 'react-icons/fa';
import './Sidebar.css';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'home', label: 'Ana Sayfa', icon: FaHome },
    { id: 'jobs', label: 'İş İlanları', icon: FaBriefcase },
    { id: 'alumni', label: 'Mezunlar', icon: FaUsers },
    { id: 'profile', label: 'Profilim', icon: FaUser },
    { id: 'map', label: 'Harita', icon: FaMap },
    { id: 'shop', label: 'Mağaza', icon: FaShoppingCart },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <FaHome size={24} />
          <span>BM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
