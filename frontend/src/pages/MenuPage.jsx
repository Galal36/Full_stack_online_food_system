import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, Plus } from 'lucide-react';
import { menuAPI } from '../api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './MenuPage.css';

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const { addItem } = useCart();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    menuAPI.getCategories().then(res => {
      setCategories(res.data.results || res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    menuAPI.getItems(params).then(res => {
      setItems(res.data.results || res.data);
    }).finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  const handleAdd = (item) => {
    addItem(item);
    toast.success(isAr ? `تمت إضافة ${item.name_ar}` : `${item.name_en} added!`);
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return item.name_en.toLowerCase().includes(q) || item.name_ar.includes(q);
  });

  return (
    <div className="page">
      <div className="container">
        <div className="menu-header">
          <div>
            <h1 className="page-title">{t('menu.title')}</h1>
            <p className="page-subtitle">{filtered.length} {isAr ? 'طبق' : 'dishes available'}</p>
          </div>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={t('menu.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="category-tabs">
          <button
            className={`cat-tab ${!activeCategory ? 'active' : ''}`}
            onClick={() => handleCategoryClick('')}
          >
            {t('menu.all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory == cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.icon} {isAr ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="loading-center">
            <p>{t('menu.no_items')}</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className="menu-card-h">
                <div className="menu-card-h-img">
                  {item.image_display ? (
                    <img src={item.image_display} alt={item.name_en} loading="lazy" />
                  ) : (
                    <div className="menu-card-placeholder">🍽️</div>
                  )}
                  {item.is_featured && (
                    <span className="badge badge-orange featured-badge">⭐</span>
                  )}
                </div>
                <div className="menu-card-h-body">
                  <div className="menu-card-h-top">
                    <span className="cat-label">
                      {isAr ? item.category_name?.ar : item.category_name?.en}
                    </span>
                    {item.is_featured && (
                      <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>{t('menu.featured')}</span>
                    )}
                  </div>
                  <h3>{isAr ? item.name_ar : item.name_en}</h3>
                  <p className="item-desc">{isAr ? item.description_ar : item.description_en}</p>
                  <div className="menu-card-h-footer">
                    <div className="item-meta">
                      <Clock size={13} />
                      <span>{item.preparation_time} {t('menu.min')}</span>
                    </div>
                    <div className="item-actions">
                      <span className="menu-price">${parseFloat(item.price).toFixed(2)}</span>
                      <button className="add-btn" onClick={() => handleAdd(item)}>
                        <Plus size={16} />
                        {t('menu.add_to_cart')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
