import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, XCircle, ChefHat } from 'lucide-react';
import { ordersAPI } from '../api';
import './OrdersPage.css';

const STATUS_ICONS = {
  pending: <Clock size={16} />,
  confirmed: <CheckCircle size={16} />,
  preparing: <ChefHat size={16} />,
  out_for_delivery: <Truck size={16} />,
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />,
};

const STATUS_COLORS = {
  pending: 'badge-yellow',
  confirmed: 'badge-orange',
  preparing: 'badge-orange',
  out_for_delivery: 'badge-orange',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

const STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    ordersAPI.getOrders().then(res => {
      setOrders(res.data.results || res.data);
    }).finally(() => setLoading(false));
  }, []);

  const stepIndex = (status) => STEPS.indexOf(status);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('orders.title')}</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <Package size={64} strokeWidth={1} />
            <p>{t('orders.no_orders')}</p>
            <span>{t('orders.no_orders_sub')}</span>
            <Link to="/menu" className="btn btn-primary">{isAr ? 'اطلب الآن' : 'Order Now'}</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card card">
                <div className="order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="order-meta">
                    <span className="order-id">{t('orders.order_id')}{order.id}</span>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="order-summary">
                    <span className={`badge ${STATUS_COLORS[order.status]}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {STATUS_ICONS[order.status]}
                      {t(`status.${order.status}`)}
                    </span>
                    <span className="order-total">${parseFloat(order.total).toFixed(2)}</span>
                    {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="order-detail">
                    {/* Tracker */}
                    {order.status !== 'cancelled' && (
                      <div className="order-tracker">
                        {STEPS.map((step, i) => {
                          const current = stepIndex(order.status);
                          const done = i <= current;
                          const active = i === current;
                          return (
                            <div key={step} className="tracker-step">
                              <div className={`tracker-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                                {done ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
                              </div>
                              <div className={`tracker-label ${active ? 'active-label' : ''}`}>
                                {t(`status.${step}`)}
                              </div>
                              {i < STEPS.length - 1 && (
                                <div className={`tracker-line ${i < current ? 'done' : ''}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Items */}
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="order-item-img">
                            {item.menu_item_detail?.image_display ? (
                              <img src={item.menu_item_detail.image_display} alt="" />
                            ) : <span>🍽️</span>}
                          </div>
                          <div className="order-item-info">
                            <strong>{isAr ? item.menu_item_name?.ar : item.menu_item_name?.en}</strong>
                            <span>×{item.quantity} · ${parseFloat(item.unit_price).toFixed(2)} each</span>
                          </div>
                          <strong>${parseFloat(item.subtotal).toFixed(2)}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer-detail">
                      <div className="order-info-row">
                        <span>{t('orders.address')}:</span>
                        <span>{order.delivery_address}</span>
                      </div>
                      <div className="order-info-row">
                        <span>{t('orders.payment')}:</span>
                        <span className={`badge ${order.payment_method === 'online' ? 'badge-green' : 'badge-gray'}`}>
                          {order.payment_method === 'cash' ? (isAr ? 'عند الاستلام' : 'Cash on Delivery') : (isAr ? 'إلكتروني' : 'Online Payment')}
                        </span>
                      </div>
                      <div className="order-totals-mini">
                        <div className="total-row"><span>{t('cart.subtotal')}</span><span>${parseFloat(order.subtotal).toFixed(2)}</span></div>
                        <div className="total-row"><span>{t('cart.delivery_fee')}</span><span>${parseFloat(order.delivery_fee).toFixed(2)}</span></div>
                        <div className="total-row total-main"><span>{t('cart.total')}</span><span>${parseFloat(order.total).toFixed(2)}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
