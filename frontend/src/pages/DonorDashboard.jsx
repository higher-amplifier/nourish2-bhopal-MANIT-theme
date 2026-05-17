import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

const STATUS_TABS = [
  { key: 'available', label: '🟢 Active', color: 'var(--manit-green)' },
  { key: 'claimed', label: '🟡 Being Picked Up', color: 'var(--amber)' },
  { key: 'completed', label: '✅ Completed', color: 'var(--blue)' },
  { key: 'expired', label: '⏱ Expired', color: 'var(--text-muted)' },
];

export default function DonorDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('available');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/listings/my');
      setListings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const totalMeals = listings.filter(l => l.status === 'completed').reduce((s, l) => s + l.quantity, 0);
  const active = listings.filter(l => l.status === 'available').length;
  const claimed = listings.filter(l => l.status === 'claimed').length;
  const completed = listings.filter(l => l.status === 'completed').length;
  const filtered = listings.filter(l => l.status === tab);
  const impactKg = (totalMeals * 0.5).toFixed(1);

  return (
    <div className="page">
      <div className="container">

        {/* MANIT Dashboard Header */}
        <div className="dash-header fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/manit-logo.png" alt="MANIT"
              style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(245,196,0,0.4))' }} />
            <div>
              <div style={{ color: 'var(--manit-yellow)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                MANIT Bhopal · Donor Dashboard
              </div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>Welcome, {user?.name} 👋</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
                {active > 0 ? `${active} active listing${active > 1 ? 's' : ''} on the map right now` : 'No active listings — post your surplus food!'}
              </div>
            </div>
          </div>
          <Link to="/create">
            <button className="btn btn-yellow btn-lg">+ Post Surplus Food</button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid-4 fade-in-up delay-1" style={{ marginBottom: 28 }}>
          <div className="stat-card grad-green hover-lift">
            <div className="stat-num" style={{ color: 'var(--green-dark)' }}>{totalMeals}</div>
            <div className="stat-label" style={{ color: 'var(--manit-green)' }}>Total meals rescued</div>
          </div>
          <div className="stat-card grad-blue hover-lift">
            <div className="stat-num" style={{ color: '#0C447C' }}>{impactKg} kg</div>
            <div className="stat-label" style={{ color: 'var(--blue)' }}>Food saved</div>
          </div>
          <div className="stat-card grad-yellow hover-lift">
            <div className="stat-num" style={{ color: '#854F0B' }}>{claimed}</div>
            <div className="stat-label" style={{ color: 'var(--amber)' }}>Being picked up now</div>
          </div>
          <div className="stat-card grad-purple hover-lift">
            <div className="stat-num" style={{ color: '#3C3489' }}>{completed}</div>
            <div className="stat-label" style={{ color: '#534AB7' }}>Successful rescues</div>
          </div>
        </div>

        {/* Impact progress */}
        {totalMeals > 0 && (
          <div className="card fade-in-up delay-2" style={{ marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>🏆 Progress to Gold Donor</span>
                <span style={{ fontSize: 13, color: 'var(--manit-green)', fontWeight: 700 }}>{totalMeals}/500 meals</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${Math.min((totalMeals / 500) * 100, 100)}%` }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{500 - totalMeals} meals to Gold status</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['🌱 Bronze', 10], ['⭐ Silver', 100], ['🏆 Gold', 500]].map(([label, req]) => (
                <div key={label} style={{ textAlign: 'center', padding: '8px 12px', borderRadius: 8, background: totalMeals >= req ? 'var(--green-light)' : 'var(--bg)', border: `1px solid ${totalMeals >= req ? 'var(--manit-green)' : 'var(--border)'}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: totalMeals >= req ? 'var(--green-dark)' : 'var(--text-muted)' }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{req}+ meals</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips card */}
        <div style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Pro tip for MANIT mess donors</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Post 30 minutes before mess closes for maximum volunteer response time. Wedding hall surplus should be posted as soon as the event ends — food is still warm and safe.
            </div>
          </div>
        </div>

        {/* Tab nav + listings */}
        <div className="tab-nav">
          {STATUS_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`tab-btn ${tab === t.key ? 'active' : ''}`}>
              {t.label}
              {listings.filter(l => l.status === t.key).length > 0 && (
                <span style={{ marginLeft: 6, background: tab === t.key ? 'var(--manit-cyan)' : 'var(--border)', color: tab === t.key ? '#fff' : 'var(--text-muted)', fontSize: 11, padding: '1px 7px', borderRadius: 999, fontWeight: 700 }}>
                  {listings.filter(l => l.status === t.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> :
          filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 52 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>
                {tab === 'available' ? '🍛' : tab === 'claimed' ? '🚴' : tab === 'completed' ? '✅' : '⏱'}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 16 }}>
                {tab === 'available' ? 'No active listings. Post your hostel or wedding surplus!' : `No ${tab} listings yet.`}
              </p>
              {tab === 'available' && <Link to="/create"><button className="btn btn-primary btn-lg">Post Food Now →</button></Link>}
            </div>
          ) : (
            <div className="grid-2">
              {filtered.map((l, i) => (
                <div key={l._id} className={`fade-in-up delay-${Math.min(i + 1, 4)}`}>
                  <ListingCard listing={l} onUpdate={fetch} />
                </div>
              ))}
            </div>
          )
        }

        {/* Mobile FAB */}
        <Link to="/create"><button className="fab" title="Post food">+</button></Link>
      </div>
    </div>
  );
}
