/* =====================================================================
   VISUAL TEAM CONTENT – edit this file to change names, bios and work.
   The order here is the order of the three photos on the page (left to right).
   Tile:  title, kind (small label at the right), img + w/h (its pixel size),
          href (leave '' if it shouldn't be clickable), video: true shows a play icon.
   ===================================================================== */
const yt = (id) => `https://youtu.be/${id}`;
const V = 'assets/visual/';

/* the music videos (thumbnails are 320x180) – shared by Slim and Sayfallah */
const VIDEOS = {
  twinkie:  { title: 'Twinkie',          img: V + 'v-twinkie.webp',    href: yt('-jiQ6s9_Q1U') },
  dnd:      { title: 'Do Not Disturb',   img: V + 'v-flag.webp',       href: yt('x7XsUbkCNKs') },
  idwiw:    { title: 'I Do What I Want', img: V + 'v-white-cap.webp',  href: yt('2J6N1qr7fSU') },
  dontcare: { title: 'Don’t Care',  img: V + 'v-dont-care.webp',  href: yt('yzBXleyhFPo') },
  couch:    { title: 'Couch',            img: V + 'v-green-hat.webp',  href: yt('SENZBz9aIIw') },
  map:      { title: 'On the Map',       img: V + 'v-bmx.webp',        href: yt('84jnkt4pXwY') },
  summer:   { title: 'Feels Like Summer',img: V + 'v-bench.webp',      href: yt('TyBSjyXMnr8') },
};
const video = (k, kind = 'Music video') => ({ ...VIDEOS[k], kind, w: 320, h: 180, video: true });
const photo = (title, kind, file, w = 843, h = 1080) => ({ title, kind, img: V + file, w, h, href: '' });

window.VISUAL_TEAM = [
  {
    slug: 'sayfallah', name: 'Sayfallah Ben Amara', label: 'Sayfallah Ben Amara',
    photo: 'assets/team/sayfallah.webp', pos: '50% 50%',
    bio: 'Sayfallah Ben Amara (often credited as Sayf ben Amara) is a Tunisian visual artist, colorist and videographer.',
    links: [],
    sections: [ { tiles: [
      video('idwiw', 'Color grading'), video('dontcare', 'Color grading'), video('couch', 'Color grading'), video('summer', 'Color grading'), video('twinkie', 'Color grading'), video('dnd', 'Color grading'),
    ]} ],
  },
  {
    slug: 'slim', name: 'Slim Allouche', label: 'Slim Allouche',
    photo: 'assets/team/slim.webp', pos: '50% 50%',
    bio: 'Slim Allouche is a music video director, videographer, photographer and video editor. Originating from Sfax, Kerkennah, constantly creating encapsulating universes through the visual landscape.',
    links: [],
    sections: [
      { heading: 'Direction and D.O.P', tiles: [
        video('twinkie'), video('dnd'), video('idwiw'), video('dontcare'), video('couch'), video('map'),
      ]},
      { heading: 'Photoshoots', tiles: [
        photo('Salt Create × RamsJamsss', 'Photoshoot', 'trench-skate.webp', 1000, 1500),
        photo('Twizzy Kabous shoot',           'Photoshoot', 'hoodies.webp'),
      ]},
    ],
  },
  {
    slug: 'hedi', name: 'Veehdi', label: 'Hedi ‘Veehdi’ Kammoun',
    photo: 'assets/team/hedi.webp', pos: '38% 50%',
    bio: 'Hedi Kammoun is a multidisciplinary visual artist, photographer, illustrator and painter working between Tunisia and Belgium. Constantly exploring new ways to bring his ideas to life.',
    links: [ { text: 'Instagram @veehdi', href: 'https://www.instagram.com/veehdi' } ],
    sections: [ { tiles: [
      photo('Echoes of Persian (2024)',                 'Photography', 'echoes-of-persian.webp'),
      photo('The woman in the blue dress (2025)',       'Photography', 'blue-dress.webp'),
      photo('The weight of an afternoon (2026)',        'Photography', 'green-sofa.webp'),
      photo('Silhouette d’été (2025)',   'Photography', 'pomme-damour.webp'),
      photo('Fête de la musique · Prini × Cera poster', 'Illustration', 'fete-de-la-musique.webp'),
      photo('After party 2026 · Prini × Cera poster',        'Illustration', 'after-party.webp'),
    ]} ],
  },
];
