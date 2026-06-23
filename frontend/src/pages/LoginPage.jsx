import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success(t('auth.login_success'));
      const next = searchParams.get('next') || '/';
      navigate(next);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">🍔</div>
        <h1 className="auth-title">{t('auth.login')}</h1>
        <p className="auth-sub">Welcome back to FoodRush</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('auth.username')}</label>
            <input
              className="form-input"
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? t('auth.logging_in') : t('auth.login')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.no_account')} <Link to="/register">{t('auth.register')}</Link>
        </div>

        <div className="demo-creds">
          <p>Demo credentials:</p>
          <code>admin / admin123</code>
          <code>testuser / user123</code>
        </div>
      </div>
    </div>
  );
}
