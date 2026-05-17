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

export default function FoodGallery({ title }) {
  const items = [
    {
      tag: 'Rescue in Action',
      img: '/gallery/rescue.jpg',
    },
    {
      tag: 'Community Support',
      img: '/gallery/community.jpg',
    },
    {
      tag: 'Mess Rescue',
      img: '/gallery/mess.jpg',
    },
    {
      tag: 'Food Distribution',
      img: '/gallery/distribution.jpg',
    },
  ];

  return (
    <div style={{ marginBottom: 40 }}>
      <h2 className="section-title">{title}</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 18,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              height: 240,
              background: '#ddd',
            }}
          >
            <img
              src={item.img}
              alt={item.tag}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                background: 'rgba(255,255,255,.9)',
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                color: '#0b3b66',
              }}
            >
              {item.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
