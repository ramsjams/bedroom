/* =====================================================================
   AUDIO TEAM CONTENT  – edit this file to add / change work.
   Links were cleaned of share-tracking junk (?si=..., utm_...).
   ===================================================================== */

/* Portfolio tiles. img = picture, w/h = its pixel size (used to lay out the columns).
   Leave href empty ("") for tiles that shouldn't be clickable. */
window.AUDIO_TILES = [
  { title: 'Bey&Bey 619 Racing campaign', cat: 'Sound design', img: 'assets/work/beybey-619.webp',            w: 596,  h: 1000, href: 'https://www.instagram.com/reel/C1uebXhMYom/' },
  { title: 'MDLBEAST Soundstorm 2024',    cat: 'Sound design', img: 'assets/work/mdlbeast-soundstorm.webp',   w: 1400, h: 1400, href: '' },
  { title: 'People of Laffa campaign',    cat: 'Music',        img: 'assets/work/people-of-laffa.webp',       w: 335,  h: 597,  href: 'https://www.instagram.com/reel/Da2waWQMzva/' },
  { title: 'Malla Laab · Tunisie Telecom campaign', cat: 'Music', img: 'assets/work/tunisie-telecom.webp',     w: 739,  h: 415,  href: 'https://www.youtube.com/watch?v=59qWcGslKqw' },
  { title: 'Traveling the country with 100 millies · Midos YouTube series', cat: 'Music', img: 'assets/work/100-millies-midos.webp', w: 962, h: 542, href: 'https://youtu.be/g2EWcWkugg0' },
  { title: 'MINI Cooper Tunisia · MINI Countryman × KVMPA', cat: 'Music', img: 'assets/work/mini-countryman.webp', w: 900, h: 1200, href: 'https://open.spotify.com/track/4d4AF1YxT0qPLiS3nzp0fA' },
  { title: 'Inno · app notifications + ad campaign', cat: 'Sound design / Music', img: 'assets/work/inno.webp',    w: 512,  h: 512,  href: '' },
];

/* Text lists below the tiles. Each item: t = title, href = link, type = optional tag. */
const sp = (kind, id) => `https://open.spotify.com/${kind}/${id}`;

window.AUDIO_LISTS = [
  { heading: 'Music production', groups: [
    { artist: 'Zdeff', items: [
      { t: 'Mensinech',  href: sp('track', '5fZZOCp3sG8tNJBxLG3ah3') },
      { t: 'Diffewent',  href: sp('track', '5uvmV2DrZM8zNfsVEKBJfd') },
      { t: '8 Mile',     href: sp('track', '1TEooYivXoGiN3mTx6bMfJ') },
      { t: 'Figaro',     href: sp('track', '1L9ATsPTfUHnjEZDTE0vuO') },
    ]},
    { artist: 'XIIVI',    items: [ { t: 'Hakka Mao',  href: sp('track', '4YbbMWKOUXJEDMl3FywDSb') } ] },
    { artist: 'DVRKBOY',  items: [ { t: '3amel Yawmi', href: sp('track', '2Fx8nj40KmSbVn9rmacQQv') } ] },
    { artist: 'Saffwizz', items: [
      { t: 'Malla La3b',  href: sp('track', '5z7WY3S3RLJpcwuZdNmS1y') },
      { t: 'Win Mechyin', href: sp('track', '760SRbHPjhSKfcjsjp4lhO') },
    ]},
    { artist: 'Koast', items: [
      { t: 'Sending My Lovin', href: sp('track', '4hQ8d73IFFye5AM4yieB4N') },
      { t: 'Barari',  href: sp('track', '3Nw0hhBau33VkcDk7mcQWT') },
      { t: 'Mikasa',  href: sp('track', '0F0CRDXHjrcB2lJZjkBhfz') },
      { t: 'Aaliyah', href: sp('track', '6hQqWBes3cWpr70R4k9Pkt') },
      { t: '3am',     href: sp('track', '0F0CRDXHjrcB2lJZjkBhfz') },   // NOTE: same link as Mikasa in your file – please check
    ]},
    { artist: 'KVMPA', items: [ { t: 'Stations',   type: 'Album', href: sp('album', '2NdGBAzM9ENecCTGxG6lHD') } ] },
  ]},
  { heading: 'Mixing & mastering', groups: [
    { artist: 'OMARA', items: [ { t: 'Hamida Djandoubi', href: sp('track', '0d3ftxhoXMBiouE5lrbAiE') } ] },
    { artist: 'XIIVI & Khlnzyy', items: [ { t: 'Street Hustler', href: 'https://youtu.be/W4TFqKxaQEs' } ] },
    { artist: 'Saffwizz', items: [ { t: 'Win Mechyin', href: sp('track', '760SRbHPjhSKfcjsjp4lhO') } ] },
    { artist: 'SOUHA', items: [
      { t: 'Asthma EP',       type: 'EP', href: sp('album', '1SXSaPs7i7XCm2RtbwmGgZ') },
      { t: 'Even If I Could', href: sp('track', '6SL0QWFFifVivSG5YN5tUf') },
      { t: 'Make It Right',   href: sp('track', '1IkbZYQisgLzjJNYMdQrcd') },
    ]},
    { artist: 'RamsJamsss', items: [
      { t: 'Congratulations', type: 'Mixtape', href: sp('album', '0u1TBTFd4hL8yzRHJYJsCh') },
      { t: 'Stomp 1',         type: 'Mixtape', href: sp('album', '3SVroqfmO5adB0kgIV4LYB') },
      { t: 'Stomp 2',         type: 'Mixtape', href: sp('album', '5ncuEN6smjC43fkBaU9PDs') },
    ]},
  ]},
];
