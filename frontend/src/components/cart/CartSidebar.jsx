import { useTranslation } from 'react-i18next';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { items, updateQty, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const handleCheckout = () => {
    onClose();
    if (!user) {
      navigate('/login?next=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>{t('cart.title')}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} strokeWidth={1} />
            <p>{t('cart.empty')}</p>
            <span>{t('cart.empty_sub')}</span>
            <Link to="/menu" className="btn btn-primary" onClick={onClose}>{t('cart.browse_menu')}</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.image_display || item.image_url ? (
                      <img src={item.image_display || item.image_url} alt="" />
                    ) : (
                      <div className="cart-item-placeholder">🍽️</div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">
                      {isAr ? item.name_ar : item.name_en}
                    </div>
                    <div className="cart-item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                    <div className="cart-item-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-totals">
                <div className="total-row">
                  <span>{t('cart.subtotal')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>{t('cart.delivery_fee')}</span>
                  <span>$5.00</span>
                </div>
                <div className="divider" />
                <div className="total-row total-main">
                  <span>{t('cart.total')}</span>
                  <span>${(total + 5).toFixed(2)}</span>
                </div>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
