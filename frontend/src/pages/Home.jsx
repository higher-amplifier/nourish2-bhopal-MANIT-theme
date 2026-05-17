import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import NourishMap from '../components/Map';
import ListingCard from '../components/ListingCard';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';
import FoodGallery from '../components/FoodGallery';

const BHOPAL = [23.2130, 77.4284];

// Animated counter hook
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return [count, ref];
}

// Live ticker items
const TICKER_ITEMS = [
  '🍛 MANIT Hostel A — 60 meals rescued today',
  '🎊 Shaadi Mahal, TT Nagar — 180 plates claimed',
  '🚴 Student volunteer reached in 8 minutes',
  '🌿 0 kg wasted at MANIT canteen this evening',
  '📍 New pickup: MP Nagar caterer — 40 meals',
  '🏆 Rohit S. crossed 100 meals rescued milestone!',
  '🍽 Upper Lake View Banquet — 220 plates available',
];

function StatCard({ value, label, suffix = '', color, bgClass }) {
  const [count, ref] = useCounter(value);
  return (
    <div ref={ref} className={`stat-card ${bgClass} hover-lift`} style={{ cursor: 'default' }}>
      <div className="stat-num" style={{ color }}>{count.toLocaleString()}{suffix}</div>
      <div className="stat-label" style={{ color }}>{label}</div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');
  const [impact, setImpact] = useState({ totalMeals: 0, totalKg: 0, totalRescues: 0 });
  const [tickerIdx, setTickerIdx] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/listings?lat=${BHOPAL[0]}&lng=${BHOPAL[1]}&radius=20&status=${filter}`);
      setListings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  useEffect(() => {
    api.get('/impact').then(r => setImpact(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % TICKER_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useSocket((event, data) => {
    if (event === 'listing:new') setListings(prev => [data, ...prev]);
    if (['listing:claimed', 'listing:unclaimed', 'listing:completed'].includes(event))
      setListings(prev => prev.map(l => l._id === data._id ? data : l));
    if (event === 'listing:deleted')
      setListings(prev => prev.filter(l => l._id !== data.id));
  });

  return (
    <div>
      {/* Live ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {TICKER_ITEMS.concat(TICKER_ITEMS).map((t, i) => (
            <span key={i} style={{ marginRight: 60, color: i % 2 === 0 ? 'var(--manit-yellow)' : '#fff' }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="page">
        <div className="container">


          {/* Live Map */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: 2 }}>
                  <span className="live-dot" /> Live food map — Bhopal
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing MANIT campus & surrounding areas</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['available', 'claimed', 'completed'].map(s => (
                  <button key={s} onClick={() => setFilter(s)}
                    className={`btn btn-sm ${filter === s ? 'btn-cyan' : 'btn-outline'}`}>
                    {s === 'available' ? '🟢' : s === 'claimed' ? '🟡' : '✅'} {s}
                  </button>
                ))}
              </div>
            </div>
            <NourishMap listings={listings} center={BHOPAL} />
          </div>
          {/* Hero — Bhopal Lake background */}
          <div className="hero-section fade-in-up">
            <div className="hero-bg" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div className="hero-badge">
                    <span className="live-dot" />
                    Live · Bhopal Food Rescue Network
                  </div>
                  <h1 className="hero-title">
                    Rescue Food from<br />
                    <span className="hl">MANIT Mess</span> &<br />
                    Bhopal Weddings
                  </h1>
                  <p className="hero-subtitle">
                    Every day, tonnes of food goes to waste in hostel messes, canteens & shaadi halls while people go hungry. We fix that — in real time.
                  </p>
                  <div className="hero-ctas">
                    {!user ? (
                      <>
                        <Link to="/register?role=donor">
                          <button className="btn btn-yellow btn-lg">🍛 I Have Surplus Food</button>
                        </Link>
                        <Link to="/register?role=volunteer">
                          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                            🚴 Volunteer to Rescue
                          </button>
                        </Link>
                      </>
                    ) : (
                      <Link to={user.role === 'donor' ? '/create' : '/dashboard'}>
                        <button className="btn btn-yellow btn-lg">
                          {user.role === 'donor' ? '+ Post Surplus Food' : '🗺 See Available Food'}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* MANIT logo in hero */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <img src="/manit-logo.png" alt="MANIT Bhopal"
                    style={{ width: 100, height: 100, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(245,196,0,0.5))' }} />
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, textAlign: 'center', fontWeight: 600 }}>
                    MAULANA AZAD NIT<br />BHOPAL
                  </div>
                </div>
              </div>
            </div>
          </div>

    

          {/* Listings */}
          <div style={{ marginBottom: 36 }}>
            <h2 className="section-title">
              {filter === 'available' ? '🟢 Available now' : filter === 'claimed' ? '🟡 Being picked up' : '✅ Completed'}
            </h2>
            {loading ? <div className="spinner" /> :
              listings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🍽</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 16 }}>No {filter} listings right now.</p>
                  {user?.role === 'donor' && <Link to="/create"><button className="btn btn-primary">Post Surplus Food Now</button></Link>}
                  {!user && <Link to="/register?role=donor"><button className="btn btn-primary">Register as Donor</button></Link>}
                </div>
              ) : (
                <div className="grid-2">
                  {listings.map((l, i) => <div key={l._id} className={`fade-in-up delay-${Math.min(i + 1, 4)}`}><ListingCard listing={l} onUpdate={fetchListings} /></div>)}
                </div>
              )
            }
          </div>
                {/* How it works */}
          <div style={{ marginBottom: 36 }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>How Nourish works</h2>
            <div className="grid-3">
              {[
                { icon: '🍛', bg: '#E1F5EE', title: 'Mess posts surplus', desc: 'MANIT hostel mess, canteen, or wedding hall posts leftover food with quantity and pickup window' },
                { icon: '🔔', bg: '#E6F1FB', title: 'Volunteer gets notified', desc: 'Nearby students and volunteers receive real-time alerts on the live map — no app needed' },
                { icon: '🤝', bg: '#FAEEDA', title: 'Food gets rescued', desc: 'Volunteer claims, picks up, delivers to those in need. Impact tracked automatically' },
              ].map((f, i) => (
                <div key={i} className={`feature-card fade-in-up delay-${i + 1}`}>
                  <div className="feature-icon" style={{ background: f.bg, fontSize: 28 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>Step {i + 1}: {f.title}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

       

          {/* Food Gallery */}
          <FoodGallery title="Why food rescue matters in Bhopal" />

          {/* CTA */}
          {!user && (
            <div style={{ background: 'var(--green-light)', borderRadius: 'var(--radius)', padding: '32px', textAlign: 'center', border: '1.5px solid #9FE1CB' }}>
              <img src="/manit-logo.png" alt="MANIT" style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 12 }} />
              <h2 style={{ fontWeight: 800, marginBottom: 8, color: 'var(--manit-navy)' }}>Start rescuing food at MANIT today</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Free to join · Takes 60 seconds · No app needed</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register?role=donor"><button className="btn btn-navy btn-lg">🍛 I run a mess / canteen</button></Link>
                <Link to="/register?role=volunteer"><button className="btn btn-primary btn-lg">🚴 I want to volunteer</button></Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      {user?.role === 'donor' && (
        <Link to="/create"><button className="fab" title="Post food">+</button></Link>
      )}
    </div>
  );
}
