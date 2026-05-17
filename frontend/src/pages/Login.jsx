import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
      {/* Left panel — Bhopal image */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bhopal-lake.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,43,94,0.85), rgba(29,158,117,0.4))' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 40 }}>
          <img src="/manit-logo.png" alt="MANIT" style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 20, filter: 'drop-shadow(0 0 14px rgba(245,196,0,0.5))' }} />
          <div style={{ color: 'var(--manit-yellow)', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Nourish</div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>MANIT Bhopal · Food Rescue</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, maxWidth: 260, margin: '0 auto', lineHeight: 1.6 }}>
            Turning hostel mess waste & wedding leftovers into meals for those who need them
          </div>
          <div style={{ marginTop: 32, display: 'flex', gap: 20, justifyContent: 'center' }}>
            {[['1240+', 'Meals Rescued'], ['620 kg', 'Food Saved'], ['48', 'Rescues Done']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--manit-yellow)', fontWeight: 900, fontSize: 20 }}>{n}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Login form */}
      <div style={{ width: 420, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, var(--manit-navy), var(--manit-cyan), var(--manit-yellow))', borderRadius: 2, marginBottom: 24 }} />
            <h2 style={{ fontWeight: 900, fontSize: 26, color: 'var(--manit-navy)', marginBottom: 6 }}>Welcome back 👋</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Login to your Nourish account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email address</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="you@manit.ac.in" required autoFocus />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--manit-green)', fontWeight: 700 }}>Join Nourish</Link>
            </p>
          </div>

          <div style={{ marginTop: 20, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Quick demo login:</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              mess@manit.ac.in · password123 (donor)<br />
              volunteer@manit.ac.in · password123 (volunteer)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
