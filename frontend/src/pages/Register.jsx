import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'donor', emoji: '🍛', label: 'Donor', desc: 'Hostel mess, canteen, wedding hall, restaurant', color: '#E1F5EE', border: 'var(--manit-green)' },
  { value: 'volunteer', emoji: '🚴', label: 'Student Volunteer', desc: 'Pick up and deliver food to those in need', color: '#E6F1FB', border: 'var(--manit-cyan)' },
  { value: 'ngo', emoji: '🏥', label: 'NGO / Shelter', desc: 'Organisation that collects and distributes food', color: '#EEEDFE', border: '#7F77DD' },
];

const DONOR_TYPES = ['MANIT Bhopal – Hostel Mess', 'MANIT Bhopal – Canteen', 'College Mess (Other)', 'Wedding Hall / Banquet', 'Restaurant / Dhaba', 'Corporate Cafeteria', 'Other'];

const BHOPAL_AREAS = [
  { label: 'MANIT Campus', lat: '23.2130', lng: '77.4284' },
  { label: 'MP Nagar', lat: '23.2389', lng: '77.4348' },
  { label: 'TT Nagar', lat: '23.2337', lng: '77.4011' },
  { label: 'Arera Colony', lat: '23.2195', lng: '77.4475' },
  { label: 'Habibganj', lat: '23.2279', lng: '77.4380' },
  { label: 'New Market', lat: '23.2375', lng: '77.4023' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: params.get('role') || '', lat: '23.2130', lng: '77.4284', donorType: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(form.role ? 2 : 1);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const pickRole = (r) => { setForm(f => ({ ...f, role: r })); setStep(2); };

  const applyArea = (area) => setForm(f => ({ ...f, lat: area.lat, lng: area.lng, address: area.label }));

  const getGPS = () => navigator.geolocation.getCurrentPosition(
    pos => setForm(f => ({ ...f, lat: pos.coords.latitude.toString(), lng: pos.coords.longitude.toString() })),
    () => alert('Could not get location. Using MANIT default.')
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.role) return setError('Please select a role');
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate(form.role === 'donor' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/manit-logo.png" alt="MANIT" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 10 }} />
          <h1 style={{ fontWeight: 900, fontSize: 26, color: 'var(--manit-navy)', marginBottom: 4 }}>Join Nourish 🌿</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>MANIT Bhopal Food Rescue Network</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {['Pick your role', 'Your details'].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '10px 16px', background: step === i + 1 ? 'var(--manit-navy)' : 'var(--white)', color: step === i + 1 ? '#fff' : 'var(--text-muted)', textAlign: 'center', fontSize: 13, fontWeight: 700, transition: 'all 0.2s', borderRight: i === 0 ? '1px solid var(--border)' : 'none' }}>
              {i + 1}. {s}
            </div>
          ))}
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}

          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 800, marginBottom: 20, fontSize: 18, color: 'var(--manit-navy)' }}>I am a...</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ROLES.map(r => (
                  <div key={r.value} onClick={() => pickRole(r.value)}
                    className="role-card" style={{ background: form.role === r.value ? r.color : 'var(--white)', borderColor: form.role === r.value ? r.border : 'var(--border)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flex: 'none' }}>{r.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{r.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{r.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: form.role === r.value ? r.border : 'var(--border)', fontSize: 20 }}>→</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={submit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer' }} onClick={() => setStep(1)}>
                <button type="button" className="btn btn-outline btn-sm">← Back</button>
                <span className={`badge badge-${form.role}`}>{ROLES.find(r => r.value === form.role)?.emoji} {form.role}</span>
              </div>

              {form.role === 'donor' && (
                <div className="form-group">
                  <label>Establishment type</label>
                  <select name="donorType" value={form.donorType} onChange={handle} required>
                    <option value="">Select your establishment</option>
                    {DONOR_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>{form.role === 'donor' ? 'Contact person' : 'Your name'}</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Rahul Sharma" required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="98765 43210" />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder={form.role === 'donor' ? 'mess@manit.ac.in' : 'you@example.com'} required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required minLength={6} />
              </div>

              <div className="form-group">
                <label>Location area</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
                  {BHOPAL_AREAS.map(a => (
                    <button key={a.label} type="button" onClick={() => applyArea(a)}
                      style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s', borderColor: form.address === a.label ? 'var(--manit-green)' : 'var(--border)', background: form.address === a.label ? 'var(--green-light)' : 'var(--white)', color: form.address === a.label ? 'var(--green-dark)' : 'var(--text-muted)', fontWeight: form.address === a.label ? 700 : 400 }}>
                      {a.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input name="address" value={form.address} onChange={handle} placeholder="Full address / landmark" required />
                  <button type="button" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={getGPS}>📍 GPS</button>
                </div>
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
                {loading ? 'Creating account...' : 'Create account →'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--manit-green)', fontWeight: 700 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
