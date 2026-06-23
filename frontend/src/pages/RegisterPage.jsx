import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', phone: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success(t('auth.register_success'));
      navigate('/login');
    } catch (err) {
      const errs = err.response?.data;
      if (errs) {
        Object.values(errs).flat().forEach(msg => toast.error(msg));
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">🍔</div>
        <h1 className="auth-title">{t('auth.register')}</h1>
        <p className="auth-sub">Join FoodRush today</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">{t('auth.first_name')}</label>
              <input className="form-input" value={form.first_name} onChange={set('first_name')} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('auth.last_name')}</label>
              <input className="form-input" value={form.last_name} onChange={set('last_name')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.username')} *</label>
            <input className="form-input" value={form.username} onChange={set('username')} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.phone')}</label>
            <input className="form-input" type="tel" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')} *</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.confirm_password')} *</label>
            <input className="form-input" type="password" value={form.password2} onChange={set('password2')} required />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            <UserPlus size={18} />
            {loading ? t('auth.registering') : t('auth.register')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.have_account')} <Link to="/login">{t('auth.login')}</Link>
        </div>
      </div>
    </div>
  );
}
