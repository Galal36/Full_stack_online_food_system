import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, Plus, Edit2, Trash2, Check, X, ChevronDown } from 'lucide-react';
import { menuAPI, ordersAPI } from '../api';
import toast from 'react-hot-toast';
import './AdminPage.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const emptyItem = { name_en: '', name_ar: '', description_en: '', description_ar: '', price: '', category: '', image_url: '', is_available: true, is_featured: false, preparation_time: 20 };

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [loading, setLoading] = useState(false);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    ordersAPI.getStats().then(r => setStats(r.data));
    menuAPI.getCategories().then(r => setCategories(r.data.results || r.data));
  }, []);

  useEffect(() => {
    if (tab === 'orders') {
      ordersAPI.getOrders().then(r => setOrders(r.data.results || r.data));
    } else if (tab === 'products') {
      menuAPI.getItems().then(r => setItems(r.data.results || r.data));
    }
  }, [tab]);

  const handleSaveItem = async () => {
    setLoading(true);
    try {
      if (editItem) {
        const res = await menuAPI.updateItem(editItem.id, form);
        setItems(items.map(i => i.id === editItem.id ? res.data : i));
        toast.success('Product updated');
      } else {
        const res = await menuAPI.createItem(form);
        setItems([res.data, ...items]);
        toast.success('Product added');
      }
      setShowForm(false);
      setEditItem(null);
      setForm(emptyItem);
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await menuAPI.deleteItem(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await ordersAPI.updateStatus(orderId, { status });
      setOrders(orders.map(o => o.id === orderId ? res.data : o));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const startEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setShowForm(true);
  };

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [k]: val });
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('admin.dashboard')}</h1>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview', 'products', 'orders'].map(tab_name => (
            <button
              key={tab_name}
              className={`admin-tab ${tab === tab_name ? 'active' : ''}`}
              onClick={() => setTab(tab_name)}
            >
              {tab_name === 'overview' && <LayoutDashboard size={16} />}
              {tab_name === 'products' && <Package size={16} />}
              {tab_name === 'orders' && <ShoppingBag size={16} />}
              {t(`admin.${tab_name}`)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && stats && (
          <div className="stats-grid">
            {[
              { label: t('admin.total_orders'), value: stats.total_orders, icon: ShoppingBag, color: '#f97316' },
              { label: t('admin.today_orders'), value: stats.today_orders, icon: TrendingUp, color: '#22c55e' },
              { label: t('admin.pending_orders'), value: stats.pending_orders, icon: Package, color: '#eab308' },
              { label: t('admin.revenue'), value: `$${parseFloat(stats.total_revenue || 0).toFixed(2)}`, icon: TrendingUp, color: '#3b82f6' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="stat-card card">
                <div className="stat-icon" style={{ background: `${color}20`, color }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditItem(null); setForm(emptyItem); }}>
                <Plus size={16} /> {t('admin.add_product')}
              </button>
            </div>

            {showForm && (
              <div className="card admin-form">
                <h3>{editItem ? t('admin.edit') : t('admin.add_product')}</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('admin.name_en')} *</label>
                    <input className="form-input" value={form.name_en} onChange={set('name_en')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.name_ar')} *</label>
                    <input className="form-input" value={form.name_ar} onChange={set('name_ar')} dir="rtl" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.description_en')}</label>
                    <textarea className="form-input" rows={2} value={form.description_en} onChange={set('description_en')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.description_ar')}</label>
                    <textarea className="form-input" rows={2} value={form.description_ar} onChange={set('description_ar')} dir="rtl" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.price')} *</label>
                    <input className="form-input" type="number" step="0.01" value={form.price} onChange={set('price')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.category')} *</label>
                    <select className="form-input" value={form.category} onChange={set('category')}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">{t('admin.image_url')}</label>
                    <input className="form-input" type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prep time (min)</label>
                    <input className="form-input" type="number" value={form.preparation_time} onChange={set('preparation_time')} />
                  </div>
                  <div className="checkboxes">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={form.is_available} onChange={set('is_available')} />
                      {t('admin.available')}
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} />
                      {t('admin.featured')}
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSaveItem} disabled={loading}>
                    <Check size={16} /> {t('admin.save')}
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditItem(null); }}>
                    <X size={16} /> {t('admin.cancel')}
                  </button>
                </div>
              </div>
            )}

            <div className="products-table card">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="table-img">
                          {item.image_display ? <img src={item.image_display} alt="" /> : <span>🍽️</span>}
                        </div>
                      </td>
                      <td>
                        <div className="table-name">
                          <strong>{item.name_en}</strong>
                          <span>{item.name_ar}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-gray">{isAr ? item.category_name?.ar : item.category_name?.en}</span></td>
                      <td><strong style={{ color: 'var(--accent)' }}>${parseFloat(item.price).toFixed(2)}</strong></td>
                      <td>
                        <span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`}>
                          {item.is_available ? t('admin.available') : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => startEdit(item)}><Edit2 size={14} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="admin-orders">
            {orders.map(order => (
              <div key={order.id} className="admin-order card">
                <div className="admin-order-head">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <span className="admin-order-date">
                      {new Date(order.created_at).toLocaleString()} · {order.user_name}
                    </span>
                  </div>
                  <div className="admin-order-actions">
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${parseFloat(order.total).toFixed(2)}</span>
                    <select
                      className="form-input"
                      style={{ width: 'auto', padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                      value={order.status}
                      onChange={e => handleUpdateStatus(order.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{t(`status.${s}`)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="admin-order-items">
                  {order.items.map(item => (
                    <span key={item.id} className="order-item-pill">
                      {isAr ? item.menu_item_name?.ar : item.menu_item_name?.en} ×{item.quantity}
                    </span>
                  ))}
                </div>
                <div className="admin-order-foot">
                  <span>📍 {order.delivery_address}</span>
                  <span>💳 {order.payment_method === 'cash' ? 'Cash on Delivery' : 'Online'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
