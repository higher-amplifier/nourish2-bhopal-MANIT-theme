// Food scarcity & rescue photo gallery — all images from Unsplash
const PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80',
    caption: 'Hunger is real — even in a city of plenty',
    tag: 'Food Scarcity',
    tagColor: '#FEE2E2',
    tagText: '#7a1f1f',
  },
  {
  url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80',
  caption: 'Together we can reduce hunger and food waste',
  tag: 'Community Support',
  tagColor: '#E6F7EE',
  tagText: '#0B6B4B',
},
  {
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80',
    caption: 'Food distribution changes lives in communities',
    tag: 'Community Impact',
    tagColor: '#E6F1FB',
    tagText: '#0C447C',
  },
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80',
    caption: 'Surplus food from celebrations can feed hundreds',
    tag: 'Wedding Surplus',
    tagColor: '#FAEEDA',
    tagText: '#854F0B',
  },
  {
    url: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=900&q=80',
    caption: 'Hostel mess leftovers rescued before reaching the bin',
    tag: 'Mess Rescue',
    tagColor: '#EEEDFE',
    tagText: '#3C3489',
  },
  {
    url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&q=80',
    caption: 'Millions still struggle with food insecurity',
    tag: 'Food Insecurity',
    tagColor: '#FEE2E2',
    tagText: '#7a1f1f',
  },
];

export default function FoodGallery({ title }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <h2
            className="section-title"
            style={{ marginBottom: 4 }}
          >
            {title}
          </h2>

          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            Every rescued meal creates real impact in Bhopal communities
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--manit-green)',
            background: 'var(--green-light)',
            padding: '6px 12px',
            borderRadius: 999,
          }}
        >
          🌿 Real Stories • Real Impact
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 18,
        }}
      >
        {PHOTOS.map((photo, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              height: 260,
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
              background: '#ddd',
            }}
          >
            <img
              src={photo.url}
              alt={photo.tag}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform .45s ease',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.08))',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                background: photo.tagColor,
                color: photo.tagText,
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {photo.tag}
            </div>

            <div
              style={{
                position: 'absolute',
                left: 18,
                right: 18,
                bottom: 18,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.45,
                textShadow: '0 2px 10px rgba(0,0,0,.35)',
              }}
            >
              {photo.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}