import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const FOOD_EMOJI = { cooked: '🍛', packaged: '📦', raw: '🥦', bakery: '🍞' };

const timeLeft = (exp) => {
  const diff = new Date(exp) - Date.now();
  if (diff <= 0) return { label: 'Expired', cls: 'timer-exp' };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const cls = diff < 1800000 ? 'timer-warn' : 'timer-ok';
  const label = h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  return { label, cls };
};

export default function ListingCard({ listing, onUpdate }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const timer = timeLeft(listing.expiresAt);

  const claim = async () => {
    setLoading(true);
    try { await api.post(`/claims/${listing._id}`); onUpdate(); }
    catch (e) { alert(e.response?.data?.message || 'Could not claim'); }
    finally { setLoading(false); }
  };

  const unclaim = async () => {
    setLoading(true);
    try { await api.delete(`/claims/${listing._id}`); onUpdate(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const confirmPickup = async () => {
    setLoading(true);
    try { await api.put(`/listings/${listing._id}/confirm`); onUpdate(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const remove = async () => {
    if (!window.confirm('Delete this listing?')) return;
    setLoading(true);
    try { await api.delete(`/listings/${listing._id}`); onUpdate(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const isMyClaim  = user && listing.claimedBy && listing.claimedBy._id === user._id;
  const isMyListing = user && listing.donor && listing.donor._id === user._id;
  const emoji = FOOD_EMOJI[listing.foodType] || '🍽';

  return (
    <div className={`listing-card ${listing.status}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
          <div style={{ fontSize: 28, lineHeight: 1, flex: 'none' }}>{emoji}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{listing.title}</div>
            <div className="meta" style={{ marginTop: 3 }}>
              <strong style={{ color: 'var(--manit-green)' }}>{listing.quantity} {listing.unit}</strong>
              {' · '}{listing.foodType}
            </div>
          </div>
        </div>
        <span className={`badge badge-${listing.status}`} style={{ flex: 'none' }}>{listing.status}</span>
      </div>

      {listing.description && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>{listing.description}</p>
      )}

      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="meta">📍 {listing.address}</div>
        <div className="meta">
          🍽 <strong>{listing.donor?.name || 'Unknown'}</strong>
          {listing.donor?.phone && <span style={{ color: 'var(--manit-cyan)' }}> · 📞 {listing.donor.phone}</span>}
        </div>
        {listing.claimedBy && (
          <div className="meta">🚴 Claimed by: <strong>{listing.claimedBy.name}</strong></div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
        <span className={`timer ${timer.cls}`}>⏱ {timer.label}</span>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Posted {new Date(listing.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </div>
      </div>

      <div className="actions">
        {user && ['volunteer', 'ngo'].includes(user.role) && listing.status === 'available' && (
          <button className="btn btn-primary btn-sm" onClick={claim} disabled={loading}>
            {loading ? '⏳' : '🤝 Claim'}
          </button>
        )}
        {isMyClaim && listing.status === 'claimed' && (
          <button className="btn btn-outline btn-sm" onClick={unclaim} disabled={loading}>Unclaim</button>
        )}
        {isMyListing && listing.status === 'claimed' && (
          <button className="btn btn-amber btn-sm" onClick={confirmPickup} disabled={loading}>
            {loading ? '⏳' : '✅ Confirm Pickup'}
          </button>
        )}
        {isMyListing && listing.status === 'available' && (
          <button className="btn btn-danger btn-sm" onClick={remove} disabled={loading}>🗑 Delete</button>
        )}
      </div>
    </div>
  );
}
