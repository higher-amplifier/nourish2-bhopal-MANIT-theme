import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TEMPLATES = [
  { icon: '🍛', label: 'Mess Leftovers', title: 'MANIT Hostel Mess Surplus', foodType: 'cooked', unit: 'meals', qty: 60, hours: 1.5, desc: 'End-of-meal surplus from hostel mess' },
  { icon: '🎊', label: 'Wedding Surplus', title: 'Wedding Banquet Surplus Food', foodType: 'cooked', unit: 'meals', qty: 200, hours: 2, desc: 'Post-event surplus from wedding banquet' },
  { icon: '🥘', label: 'Canteen Extra', title: 'Canteen End-of-Day Food', foodType: 'cooked', unit: 'meals', qty: 30, hours: 1, desc: 'Closing time surplus from canteen' },
  { icon: '📦', label: 'Packaged Items', title: 'Packaged Food / Snacks', foodType: 'packaged', unit: 'packets', qty: 50, hours: 24, desc: 'Sealed packaged food items' },
];

const LOCATIONS = [
  { label: 'MANIT Hostel Area', lat: '23.2130', lng: '77.4284' },
  { label: 'MANIT Main Canteen', lat: '23.2145', lng: '77.4301' },
  { label: 'MP Nagar', lat: '23.2389', lng: '77.4348' },
  { label: 'TT Nagar', lat: '23.2337', lng: '77.4011' },
  { label: 'Arera Colony', lat: '23.2195', lng: '77.4475' },
  { label: 'Habibganj', lat: '23.2279', lng: '77.4380' },
  { label: 'New Market', lat: '23.2375', lng: '77.4023' },
];

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', quantity: '', unit: 'meals', foodType: 'cooked', address: '', lat: '23.2130', lng: '77.4284', expiresInHours: 2 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyTemplate = (t, idx) => {
    setActiveTemplate(idx);
    setForm(f => ({ ...f, title: t.title, foodType: t.foodType, unit: t.unit, quantity: t.qty, expiresInHours: t.hours, description: t.desc }));
  };

  const applyLocation = (loc) => {
    setActiveLocation(loc.label);
    setForm(f => ({ ...f, lat: loc.lat, lng: loc.lng, address: loc.label }));
  };

  const getGPS = () => navigator.geolocation.getCurrentPosition(
    pos => setForm(f => ({ ...f, lat: pos.coords.latitude.toString(), lng: pos.coords.longitude.toString() })),
    () => alert('Could not get GPS. Using MANIT default.')
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.address) return setError('Please set a pickup location');
    setError(''); setLoading(true);
    try {
      await api.post('/listings', { ...form, quantity: Number(form.quantity) });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post listing');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <img src="/manit-logo.png" alt="MANIT" style={{ width: 50, height: 50, objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--manit-navy)', marginBottom: 2 }}>Post Surplus Food</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Hello {user?.name} — let's rescue some food 🌿</p>
          </div>
        </div>

        {/* Quick templates */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>⚡ Quick templates</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {TEMPLATES.map((t, i) => (
              <button key={i} type="button" onClick={() => applyTemplate(t, i)}
                className={`template-btn ${activeTemplate === i ? 'selected' : ''}`}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--manit-navy)' }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>

            <div className="form-group">
              <label>Listing title</label>
              <input name="title" value={form.title} onChange={handle} placeholder="e.g. MANIT Hostel A – Lunch Surplus" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input name="quantity" type="number" min="1" value={form.quantity} onChange={handle} placeholder="e.g. 80" required />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={form.unit} onChange={handle}>
                  <option value="meals">Meals / Plates</option>
                  <option value="kg">Kilograms</option>
                  <option value="packets">Packets</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Food type</label>
                <select name="foodType" value={form.foodType} onChange={handle}>
                  <option value="cooked">🍛 Cooked food</option>
                  <option value="packaged">📦 Packaged / sealed</option>
                  <option value="raw">🥦 Raw ingredients</option>
                  <option value="bakery">🍞 Bakery / sweets</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pickup window</label>
                <select name="expiresInHours" value={form.expiresInHours} onChange={handle}>
                  <option value={0.5}>30 minutes</option>
                  <option value={1}>1 hour</option>
                  <option value={1.5}>1.5 hours</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={24}>24 hours (packaged)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea name="description" value={form.description} onChange={handle} rows={2}
                placeholder="Any details — allergens, breakdown, special handling..." />
            </div>

            <div className="form-group">
              <label>📍 Pickup location</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
                {LOCATIONS.map(loc => (
                  <button key={loc.label} type="button" onClick={() => applyLocation(loc)}
                    style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.15s', borderColor: activeLocation === loc.label ? 'var(--manit-green)' : 'var(--border)', background: activeLocation === loc.label ? 'var(--green-light)' : 'var(--white)', color: activeLocation === loc.label ? 'var(--green-dark)' : 'var(--text-muted)' }}>
                    {loc.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input name="address" value={form.address} onChange={handle} placeholder="Full address / landmark in Bhopal" required />
                <button type="button" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={getGPS}>📍 GPS</button>
              </div>
            </div>

            {/* Preview card */}
            {form.title && form.quantity && (
              <div style={{ background: 'var(--green-light)', border: '1.5px solid #9FE1CB', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-dark)', textTransform: 'uppercase', marginBottom: 6 }}>Preview</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{form.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  {form.quantity} {form.unit} · {form.foodType} · pickup within {form.expiresInHours}h · {form.address || 'no location set'}
                </div>
              </div>
            )}

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? '⏳ Posting...' : '🌿 Post food listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
