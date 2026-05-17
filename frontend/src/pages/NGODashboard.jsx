import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import NourishMap from '../components/Map';

const BHOPAL = [23.2130, 77.4284];

export default function NGODashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [impact, setImpact] = useState({});
  const [tab, setTab] = useState('available');
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [avRes, clRes, impRes] = await Promise.all([
        api.get(`/listings?lat=${BHOPAL[0]}&lng=${BHOPAL[1]}&radius=25&status=available`),
        api.get('/claims/mine'),
        api.get('/impact'),
      ]);
      setAvailable(avRes.data);
      setMyClaims(clRes.data);
      setImpact(impRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="page">
      <div className="container">

        <div className="dash-header fade-in-up" style={{ background: 'linear-gradient(135deg, #185FA5 0%, #1a4a9e 100%)', borderBottom: '3px solid var(--manit-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/manit-logo.png" alt="MANIT" style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(0,168,204,0.5))' }} />
            <div>
              <div style={{ color: 'var(--manit-cyan)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>NGO Dashboard · Bhopal Food Network</div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>{user?.name} 🏥</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{available.length} food listing{available.length !== 1 ? 's' : ''} available now</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--manit-cyan)', fontWeight: 900, fontSize: 28 }}>{myClaims.filter(l => l.status === 'claimed').length}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>active claims</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 28 }}>{impact.totalMeals || 0}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>city meals rescued</div>
            </div>
          </div>
        </div>

        {/* City impact row */}
        <div className="grid-4 fade-in-up delay-1" style={{ marginBottom: 24 }}>
          <div className="stat-card grad-green hover-lift"><div className="stat-num" style={{ color: 'var(--green-dark)' }}>{impact.totalMeals || 0}</div><div className="stat-label" style={{ color: 'var(--manit-green)' }}>Meals rescued</div></div>
          <div className="stat-card grad-blue hover-lift"><div className="stat-num" style={{ color: '#0C447C' }}>{impact.totalKg || 0} kg</div><div className="stat-label" style={{ color: 'var(--blue)' }}>Food saved</div></div>
          <div className="stat-card grad-purple hover-lift"><div className="stat-num" style={{ color: '#3C3489' }}>{impact.totalCO2 || 0} kg</div><div className="stat-label" style={{ color: '#534AB7' }}>CO₂ avoided</div></div>
          <div className="stat-card grad-yellow hover-lift"><div className="stat-num" style={{ color: '#854F0B' }}>{impact.totalRescues || 0}</div><div className="stat-label" style={{ color: 'var(--amber)' }}>Total rescues</div></div>
        </div>

        <div className="tab-nav">
          {[['available', `🟢 Available (${available.length})`], ['map', '🗺 Map View'], ['claims', `✅ Our Claims (${myClaims.length})`]].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} className={`tab-btn ${tab === val ? 'active' : ''}`}>{label}</button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {tab === 'available' && (
              available.length === 0
                ? <div className="card" style={{ textAlign: 'center', padding: 52 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🍛</div><p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No available listings right now. Check back at meal times!</p></div>
                : <div className="grid-2 fade-in-up">{available.map((l, i) => <div key={l._id} className={`fade-in-up delay-${Math.min(i+1,4)}`}><ListingCard listing={l} onUpdate={fetchAll} /></div>)}</div>
            )}
            {tab === 'map' && (
              <div className="fade-in-up">
                <NourishMap listings={[...available, ...myClaims]} center={BHOPAL} />
              </div>
            )}
            {tab === 'claims' && (
              myClaims.length === 0
                ? <div className="card" style={{ textAlign: 'center', padding: 52 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div><p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No claims yet. Go to Available tab to claim food for your shelter.</p></div>
                : <div className="grid-2 fade-in-up">{myClaims.map((l, i) => <div key={l._id} className={`fade-in-up delay-${Math.min(i+1,4)}`}><ListingCard listing={l} onUpdate={fetchAll} /></div>)}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
