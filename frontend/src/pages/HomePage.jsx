import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronRight, Clock, Star } from 'lucide-react';
import { menuAPI } from '../api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './HomePage.css';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    Promise.all([
      menuAPI.getItems({ is_featured: true }),
      menuAPI.getCategories(),
    ]).then(([itemsRes, catRes]) => {
      setFeatured(itemsRes.data.results || itemsRes.data);
      setCategories(catRes.data.results || catRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = (item) => {
    addItem(item);
    toast.success(isAr ? `تمت إضافة ${item.name_ar}` : `${item.name_en} added to cart`);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">🔥 Fast Delivery · Fresh Food</div>
          <h1 className="hero-title">
            {t('home.hero_title')}<br />
            <span className="accent-text">{t('home.hero_title2')}</span>
          </h1>
          <p className="hero-subtitle">{t('home.hero_subtitle')}</p>
          <div className="hero-cta">
            <Link to="/menu" className="btn btn-primary btn-lg">
              {t('home.order_now')} <ArrowRight size={18} />
            </Link>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              {t('home.explore_menu')}
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Dishes</span></div>
            <div className="stat-sep" />
            <div className="stat"><strong>30min</strong><span>Avg delivery</span></div>
            <div className="stat-sep" />
            <div className="stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=500&fit=crop"
              alt="Food"
            />
            <div className="hero-float hero-float-1">
              <span>🍔</span> Classic Burger
              <strong>$12.99</strong>
            </div>
            <div className="hero-float hero-float-2">
              <span>⏱</span> 15 min delivery
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">{t('home.categories')}</h2>
          <Link to="/menu" className="see-all">
            {isAr ? 'عرض الكل' : 'See all'} <ChevronRight size={16} />
          </Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link key={cat.id} to={`/menu?category=${cat.id}`} className="category-card">
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{isAr ? cat.name_ar : cat.name_en}</div>
              <div className="cat-count">{cat.item_count} items</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">{t('home.featured')}</h2>
          <Link to="/menu" className="see-all">
            {isAr ? 'عرض الكل' : 'See all'} <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="grid-3">
            {featured.map(item => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-img">
                  {item.image_display ? (
                    <img src={item.image_display} alt={item.name_en} loading="lazy" />
                  ) : (
                    <div className="menu-card-placeholder">🍽️</div>
                  )}
                  <div className="menu-card-badges">
                    <span className="badge badge-orange">⭐ {t('menu.featured')}</span>
                  </div>
                </div>
                <div className="menu-card-body">
                  <h3>{isAr ? item.name_ar : item.name_en}</h3>
                  <p>{isAr ? item.description_ar : item.description_en}</p>
                  <div className="menu-card-meta">
                    <Clock size={13} />
                    <span>{item.preparation_time} {t('menu.min')}</span>
                  </div>
                  <div className="menu-card-footer">
                    <span className="menu-price">${parseFloat(item.price).toFixed(2)}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAdd(item)}>
                      {t('menu.add_to_cart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
