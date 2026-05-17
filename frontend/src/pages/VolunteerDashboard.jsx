import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import NourishMap from '../components/Map';
import { useSocket } from '../hooks/useSocket';

const BHOPAL = [23.2130, 77.4284];
const BADGE_INFO = {
  'First Five':   { emoji: '🌱', desc: '5+ meals rescued', color: '#E1F5EE', textColor: '#085041' },
  'Hunger Hero':  { emoji: '⭐', desc: '50+ meals rescued', color: '#FFFBEB', textColor: '#854F0B' },
  'Food Guardian':{ emoji: '🏆', desc: '200+ meals rescued', color: '#EEEDFE', textColor: '#3C3489' },
};

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState('map');
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [avRes, clRes, impRes] = await Promise.all([
        api.get(`/listings?lat=${BHOPAL[0]}&lng=${BHOPAL[1]}&radius=15&status=available`),
        api.get('/claims/mine'),
        api.get('/impact'),
      ]);
      setAvailable(avRes.data);
      setMyClaims(clRes.data);
      setLeaderboard(impRes.data.leaderboard || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useSocket((event, data) => {
    if (event === 'listing:new') setAvailable(prev => [data, ...prev]);
    if (['listing:claimed', 'listing:unclaimed', 'listing:completed'].includes(event)) fetchAll();
    if (event === 'listing:deleted') setAvailable(prev => prev.filter(l => l._id !== data.id));
  });

  const activeClaim = myClaims.find(l => l.status === 'claimed');
  const mealsRescued = user?.mealsRescued || 0;
  const nextMilestone = mealsRescued < 5 ? 5 : mealsRescued < 50 ? 50 : mealsRescued < 200 ? 200 : 500;
  const progress = Math.min((mealsRescued / nextMilestone) * 100, 100);

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div className="dash-header fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/manit-logo.png" alt="MANIT"
              style={{ width: 58, height: 58, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(245,196,0,0.4))' }} />
            <div>
              <div style={{ color: 'var(--manit-yellow)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Volunteer Dashboard · MANIT Bhopal
              </div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>Hey {user?.name}! 🚴</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
                <span className="live-dot" /> {available.length} listing{available.length !== 1 ? 's' : ''} waiting near you
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--manit-yellow)', fontWeight: 900, fontSize: 30 }}>{mealsRescued}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>meals rescued</div>
            </div>
            <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 30 }}>{myClaims.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>total claims</div>
            </div>
          </div>
        </div>

        {/* Active claim alert */}
        {activeClaim && (
          <div className="alert alert-success fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <div>
              <div style={{ fontWeight: 700 }}>Active claim: {activeClaim.title}</div>
              <div style={{ fontSize: 13 }}>
                📍 {activeClaim.address}
                {activeClaim.donor?.phone && <span> · 📞 Call donor: <strong>{activeClaim.donor.phone}</strong></span>}
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        {user?.badges?.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }} className="fade-in-up delay-1">
            {user.badges.map(b => {
              const info = BADGE_INFO[b] || { emoji: '🏅', desc: '', color: '#f0f0f0', textColor: '#444' };
              return (
                <div key={b} style={{ background: info.color, border: `1.5px solid ${info.textColor}33`, borderRadius: 'var(--radius)', padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 22 }}>{info.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: info.textColor }}>{b}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{info.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress bar to next milestone */}
        <div className="card fade-in-up delay-2" style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              {mealsRescued < 5 ? '🌱 Working toward First Five' : mealsRescued < 50 ? '⭐ Working toward Hunger Hero' : mealsRescued < 200 ? '🏆 Working toward Food Guardian' : '🌟 Legend status!'}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--manit-green)', fontSize: 14 }}>{mealsRescued} / {nextMilestone}</span>
          </div>
          <div className="progress-wrap">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
            {nextMilestone - mealsRescued} more meals to unlock next badge
          </div>
        </div>

        {/* Tab nav */}
        <div className="tab-nav">
          {[
            ['map', '🗺 Live Map'],
            ['list', `🟢 Available (${available.length})`],
            ['claims', `✅ My Claims (${myClaims.length})`],
            ['board', '🏆 Leaderboard'],
          ].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} className={`tab-btn ${tab === val ? 'active' : ''}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {tab === 'map' && (
              <div className="fade-in-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className="live-dot" />
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {available.length} available listing{available.length !== 1 ? 's' : ''} near MANIT Bhopal — updated live
                  </p>
                </div>
                <NourishMap listings={[...available, ...myClaims]} center={BHOPAL} />
                <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>🟢 Available</span>
                  <span>🟡 Claimed</span>
                  <span>🔵 Completed</span>
                </div>
              </div>
            )}

            {tab === 'list' && (
              <div className="fade-in-up">
                {available.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: 52 }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🍛</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No available listings right now near MANIT.</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Check back at meal times — mess usually posts around 1:30 PM and 8:30 PM.</p>
                  </div>
                ) : (
                  <div className="grid-2">
                    {available.map((l, i) => (
                      <div key={l._id} className={`fade-in-up delay-${Math.min(i + 1, 4)}`}>
                        <ListingCard listing={l} onUpdate={fetchAll} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'claims' && (
              <div className="fade-in-up">
                {myClaims.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: 52 }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🚴</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>You haven't claimed any listings yet.</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Head to the Live Map or Available tab to claim food!</p>
                  </div>
                ) : (
                  <div className="grid-2">
                    {myClaims.map((l, i) => (
                      <div key={l._id} className={`fade-in-up delay-${Math.min(i + 1, 4)}`}>
                        <ListingCard listing={l} onUpdate={fetchAll} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'board' && (
              <div className="card fade-in-up">
                <h3 style={{ fontWeight: 800, marginBottom: 6, color: 'var(--manit-navy)', fontSize: 18 }}>🏆 Bhopal Top Rescuers</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>MANIT students & Bhopal volunteers ranked by meals rescued</p>
                {leaderboard.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>No data yet — be the first on the board!</p>
                ) : leaderboard.map((v, i) => (
                  <div key={v._id} className="lb-row" style={{ background: v._id === user?._id ? 'var(--green-light)' : 'transparent', borderRadius: 8, padding: '12px 8px' }}>
                    <span className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>
                        {v.name} {v._id === user?._id && <span style={{ fontSize: 12, color: 'var(--manit-green)' }}>(you)</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        {v.badges?.map(b => (
                          <span key={b} style={{ fontSize: 11, background: '#FAEEDA', color: '#854F0B', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                            {BADGE_INFO[b]?.emoji || '🏅'} {b}
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
