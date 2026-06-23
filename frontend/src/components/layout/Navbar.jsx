import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, Globe, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar({ onCartOpen }) {
  const { t, i18n } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🍔</span>
          <span>FoodRush</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)}>{t('nav.menu')}</Link>
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)}>{t('nav.orders')}</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}><LayoutDashboard size={15} /> {t('nav.admin')}</Link>}
        </div>

        <div className="nav-actions">
          <button className="btn btn-ghost btn-sm lang-btn" onClick={toggleLang}>
            <Globe size={16} />
            {i18n.language === 'en' ? 'عربي' : 'EN'}
          </button>

          <button className="cart-btn" onClick={onCartOpen}>
            <ShoppingCart size={20} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>

          {user ? (
            <div className="user-menu-wrap">
              <button className="user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="user-avatar">{(user.first_name || user.username)[0].toUpperCase()}</div>
                <span className="user-name">{user.first_name || user.username}</span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)}>{t('nav.orders')}</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setUserMenuOpen(false)}>{t('nav.admin')}</Link>}
                  <div className="divider" style={{ margin: '0.5rem 0' }} />
                  <button onClick={handleLogout}>{t('nav.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
