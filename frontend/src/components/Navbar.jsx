import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* MANIT color strip */}
      <div className="manit-strip" />

      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img
            src="/manit-logo.png"
            alt="MANIT Bhopal"
            style={{ width: 42, height: 42, objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(245,196,0,0.4))' }}
          />
          <div>
            <div>Nourish</div>
            <span className="brand-sub">MANIT Bhopal · Food Rescue</span>
          </div>
        </Link>

        <div className="navbar-links">
          <Link to="/">
            <button className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}>🗺 Live Map</button>
          </Link>
          <Link to="/impact">
            <button className={`nav-link ${isActive('/impact') ? 'nav-link-active' : ''}`}>📊 Impact</button>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard">
                <button className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}>
                  {user.role === 'donor' ? '🍛' : user.role === 'ngo' ? '🏥' : '🚴'} Dashboard
                </button>
              </Link>
              {user.role === 'donor' && (
                <Link to="/create">
                  <button className="btn btn-yellow btn-sm">+ Post Food</button>
                </Link>
              )}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                  onClick={() => setOpen(!open)}>
                  {user.name.split(' ')[0]} ▾
                </button>
                {open && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 10, padding: 8, minWidth: 160, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100 }}>
                    <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{user.name}</div>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--manit-red)', borderRadius: 6, fontWeight: 500 }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"><button className="nav-link">Login</button></Link>
              <Link to="/register"><button className="btn btn-yellow btn-sm">Join Now</button></Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
