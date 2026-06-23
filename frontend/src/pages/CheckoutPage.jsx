import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const [form, setForm] = useState({
    delivery_address: user?.address || '',
    phone: user?.phone || '',
    notes: '',
    payment_method: 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ menu_item: i.id, quantity: i.quantity })),
      };
      const res = await ordersAPI.createOrder(payload);
      clearCart();
      setSuccess(res.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div className="success-card card">
            <CheckCircle size={64} color="var(--success)" strokeWidth={1.5} />
            <h2>{isAr ? 'تم استلام طلبك!' : 'Order Placed!'}</h2>
            <p>{isAr ? `رقم الطلب #${success.id}` : `Order #${success.id} confirmed`}</p>
            <div className="success-detail">
              <div>{isAr ? 'الإجمالي' : 'Total'}: <strong>${parseFloat(success.total).toFixed(2)}</strong></div>
              <div>{isAr ? 'طريقة الدفع' : 'Payment'}: <strong>{success.payment_method === 'cash' ? (isAr ? 'عند الاستلام' : 'Cash on Delivery') : (isAr ? 'إلكتروني' : 'Online')}</strong></div>
            </div>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/orders')}>
                {isAr ? 'تتبع الطلب' : 'Track Order'}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/menu')}>
                {isAr ? 'طلب مرة أخرى' : 'Order More'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('checkout.title')}</h1>
        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="card checkout-section">
              <h3>{t('checkout.delivery_info')}</h3>
              <div className="form-group">
                <label className="form-label">{t('checkout.address')} *</label>
                <textarea className="form-input" value={form.delivery_address} onChange={set('delivery_address')} required rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('checkout.phone')} *</label>
                <input className="form-input" type="tel" value={form.phone} onChange={set('phone')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('checkout.notes')}</label>
                <textarea className="form-input" value={form.notes} onChange={set('notes')} placeholder={t('checkout.notes_placeholder')} rows={2} />
              </div>
            </div>

            <div className="card checkout-section">
              <h3>{t('checkout.payment')}</h3>
              <div className="payment-options">
                <label className={`payment-option ${form.payment_method === 'cash' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="cash" checked={form.payment_method === 'cash'} onChange={set('payment_method')} />
                  <Banknote size={22} />
                  <div>
                    <strong>{t('checkout.cash')}</strong>
                    <span>{t('checkout.cash_desc')}</span>
                  </div>
                </label>
                <label className={`payment-option ${form.payment_method === 'online' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="online" checked={form.payment_method === 'online'} onChange={set('payment_method')} />
                  <CreditCard size={22} />
                  <div>
                    <strong>{t('checkout.online')}</strong>
                    <span>{t('checkout.online_desc')}</span>
                  </div>
                </label>
              </div>

              {form.payment_method === 'online' && (
                <div className="card-form">
                  <div className="form-group">
                    <label className="form-label">{t('checkout.card_number')}</label>
                    <input className="form-input" placeholder="4242 4242 4242 4242" maxLength={19} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t('checkout.expiry')}</label>
                      <input className="form-input" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('checkout.cvv')}</label>
                      <input className="form-input" placeholder="123" maxLength={4} />
                    </div>
                  </div>
                  <div className="payment-secure">🔒 {isAr ? 'دفع آمن ومشفر' : 'Secure payment — prototype mode'}</div>
                </div>
              )}
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading || !items.length}>
              {loading ? t('checkout.placing') : t('checkout.place_order')}
            </button>
          </form>

          {/* Summary */}
          <div className="checkout-summary">
            <div className="card checkout-section">
              <h3>{t('checkout.order_summary')}</h3>
              <div className="summary-items">
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="summary-item-name">
                      {isAr ? item.name_ar : item.name_en} × {item.quantity}
                    </span>
                    <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className="summary-totals">
                <div className="total-row"><span>{t('cart.subtotal')}</span><span>${total.toFixed(2)}</span></div>
                <div className="total-row"><span>{t('cart.delivery_fee')}</span><span>$5.00</span></div>
                <div className="total-row total-main"><span>{t('cart.total')}</span><span>${(total + 5).toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
