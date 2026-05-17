import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FoodGallery from '../components/FoodGallery';

const BADGE_EMOJI = { 'First Five': '🌱', 'Hunger Hero': '⭐', 'Food Guardian': '🏆' };

function AnimCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let start = 0; const step = target / (duration / 16);
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
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const FOOD_FACTS = [
  { emoji: '🍽', stat: '40%', text: 'of India\'s food production is wasted every year' },
  { emoji: '😔', stat: '200M', text: 'Indians go to sleep hungry every single night' },
  { emoji: '🏫', stat: '500+', text: 'hostels across India waste food daily with no system' },
  { emoji: '🎊', stat: '40%', text: 'of wedding food in India gets thrown away unused' },
];

export default function Impact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/impact').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero with Bhopal lake */}
      <div style={{ position: 'relative', minHeight: 360, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bhopal-lake.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 50%', filter: 'brightness(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,43,94,0.8), rgba(29,158,117,0.4))' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center', padding: '60px 20px' }}>
          <img src="/manit-logo.png" alt="MANIT" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 16, filter: 'drop-shadow(0 0 16px rgba(245,196,0,0.6))' }} />
          <div style={{ color: 'var(--manit-yellow)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            MANIT Bhopal · Food Rescue Network
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, marginBottom: 14, lineHeight: 1.2 }}>
            Real Impact.<br />
            <span style={{ color: 'var(--manit-yellow)' }}>Real People. Real Bhopal.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 480, margin: '0 auto', fontSize: 16 }}>
            Every number below is a meal that didn't go to waste — rescued from MANIT hostel mess, a wedding hall, or a canteen in Bhopal.
          </p>
        </div>
      </div>

      <div className="page">
        <div className="container">

          {/* Big impact numbers */}
          <div style={{ marginTop: -40, marginBottom: 36, position: 'relative', zIndex: 3 }}>
            <div className="grid-4">
              {[
                { bg: 'linear-gradient(135deg,#002B5E,#1a4a7a)', border: 'var(--manit-cyan)', val: data?.totalMeals || 1240, suffix: '', label: '🍽 Meals rescued', textColor: '#fff', numColor: 'var(--manit-yellow)' },
                { bg: 'linear-gradient(135deg,#1D9E75,#085041)', border: '#9FE1CB', val: data?.totalKg || 620, suffix: ' kg', label: '🌾 Food saved', textColor: '#fff', numColor: '#fff' },
                { bg: 'linear-gradient(135deg,#EEEDFE,#D0CDFB)', border: '#C4B5FD', val: data?.totalCO2 || 1550, suffix: ' kg', label: '🌍 CO₂ avoided', textColor: '#3C3489', numColor: '#3C3489' },
                { bg: 'linear-gradient(135deg,#FFFBEB,#FDE68A)', border: '#FCD34D', val: data?.totalRescues || 48, suffix: '', label: '🤝 Total rescues', textColor: '#854F0B', numColor: '#854F0B' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 'var(--radius)', padding: '24px 20px', textAlign: 'center', boxShadow: 'var(--shadow-md)', transform: 'translateY(0)', transition: 'transform 0.2s' }}
                  className="hover-lift">
                  <div style={{ fontSize: 36, fontWeight: 900, color: s.numColor }}>
                    {loading ? '—' : <AnimCounter target={s.val} suffix={s.suffix} />}
                  </div>
                  <div style={{ fontSize: 13, color: s.textColor, marginTop: 6, fontWeight: 600, opacity: 0.85 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Food crisis facts */}
          <div style={{ marginBottom: 36 }}>
            <h2 className="section-title">Why this exists</h2>
            <div className="grid-2">
              {FOOD_FACTS.map((f, i) => (
                <div key={i} className="card card-hover fade-in-up" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 32, flex: 'none' }}>{f.emoji}</div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--manit-navy)' }}>{f.stat}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bhopal image + who we serve */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36, alignItems: 'start' }}>
            <div>
              <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: 260, position: 'relative', boxShadow: 'var(--shadow-md)' }}>
                <img src="/bhopal-lake.jpg" alt="Bhopal Upper Lake" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,43,94,0.7), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16, color: '#fff' }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Upper Lake, Bhopal</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>City of Lakes · Active rescue zone</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <div style={{ flex: 1, borderRadius: 10, overflow: 'hidden', height: 100, background: 'linear-gradient(135deg,#F5C400,#EF9F27)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                  <img src="/manit-logo.png" alt="MANIT" style={{ width: 48, objectFit: 'contain' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--manit-navy)' }}>MANIT HQ</span>
                </div>
                <div style={{ flex: 1, borderRadius: 10, background: 'linear-gradient(135deg, var(--manit-navy), #1a4a7a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: '#fff' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--manit-yellow)' }}>24/7</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Active network</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 800, marginBottom: 18, color: 'var(--manit-navy)', fontSize: 18 }}>Who we serve in Bhopal</h3>
              {[
                { icon: '🏫', name: 'MANIT Bhopal', desc: '5 hostels · Central mess · 3 canteens · ~5000 students', pct: 92 },
                { icon: '🎊', name: 'Wedding Halls', desc: 'TT Nagar, Arera Colony, MP Nagar banquet venues', pct: 75 },
                { icon: '🏛', name: 'Other Colleges', desc: 'RGPV, LNCT, Barkatullah University, IISER', pct: 60 },
                { icon: '🍽', name: 'Restaurants & Dhabas', desc: 'MP Nagar, Habibganj, New Market zone', pct: 48 },
                { icon: '🏢', name: 'Corporate Caterers', desc: 'Event leftovers from offices & conferences', pct: 35 },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--manit-green)' }}>{item.pct}%</span>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-fill" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food Gallery */}
          <FoodGallery />

          {/* Leaderboard */}
          {!loading && data?.leaderboard?.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 className="section-title">🏆 Top Volunteers — Bhopal</h2>
              <div className="card">
                {data.leaderboard.map((v, i) => (
                  <div key={v._id} className="lb-row">
                    <span className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{v.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        {v.badges?.map(b => (
                          <span key={b} style={{ fontSize: 12, background: '#FAEEDA', color: '#854F0B', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                            {BADGE_EMOJI[b] || '🏅'} {b}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--manit-green)' }}>{v.mealsRescued}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>meals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, var(--manit-navy), #1a4a7a)', borderRadius: 'var(--radius)', padding: '36px 32px', textAlign: 'center', border: '1.5px solid rgba(0,168,204,0.4)' }}>
            <img src="/manit-logo.png" alt="MANIT" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 16, filter: 'drop-shadow(0 0 10px rgba(245,196,0,0.5))' }} />
            <h2 style={{ fontWeight: 900, marginBottom: 8, color: '#fff', fontSize: 24 }}>
              Be part of Bhopal's food rescue story
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 24, maxWidth: 460, margin: '0 auto 24px', fontSize: 15 }}>
              MANIT students, hostel wardens, wedding venues, NGOs — everyone has a role to play.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register?role=donor"><button className="btn btn-yellow btn-lg">🍛 Register as Donor</button></Link>
              <Link to="/register?role=volunteer"><button className="btn btn-primary btn-lg">🚴 Volunteer Now</button></Link>
              <Link to="/register?role=ngo"><button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>🏥 Register NGO</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
