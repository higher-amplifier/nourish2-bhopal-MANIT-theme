// Food scarcity & rescue photo gallery — all images from Unsplash (free, browser-loaded)
const PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    caption: 'Hunger is real — even in a city of plenty',
    tag: 'Food Scarcity',
    tagColor: '#FEE2E2', tagText: '#7a1f1f',
  },
  {
    url: 'https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?w=600&q=80',
    caption: 'Volunteers making a difference — one meal at a time',
    tag: 'Rescue in Action',
    tagColor: '#E1F5EE', tagText: '#085041',
  },
  {
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    caption: 'Food distribution changes lives in communities',
    tag: 'Community Impact',
    tagColor: '#E6F1FB', tagText: '#0C447C',
  },
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    caption: 'Surplus food from celebrations can feed hundreds',
    tag: 'Wedding Surplus',
    tagColor: '#FAEEDA', tagText: '#854F0B',
  },
  {
    url: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=600&q=80',
    caption: 'Hostel mess leftovers — rescued before they reach the bin',
    tag: 'Mess Rescue',
    tagColor: '#EEEDFE', tagText: '#3C3489',
  },
  {
    url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
    caption: '200M Indians go to sleep hungry every night',
    tag: 'Food Insecurity',
    tagColor: '#FEE2E2', tagText: '#7a1f1f',
  },
];

export default function FoodGallery({ title = 'The reality we\'re fighting' }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--manit-navy)', marginBottom: 6 }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
        Real images. Real problem. Real solution — built right here at MANIT Bhopal.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {PHOTOS.map((p, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', height: 200, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
            onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}>
            <img
              src={p.url}
              alt={p.caption}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#f0f0f0'; }}
            />
            {/* Always visible tag */}
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <span style={{ background: p.tagColor, color: p.tagText, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{p.tag}</span>
            </div>
            {/* Hover overlay */}
            <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'flex-end', padding: 14 }}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{p.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
