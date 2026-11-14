/* =====================================================================
   RELEASES (Bedroom Records) – edit this file.
   Order = order on the endless wheel. `start: true` = the one in the centre on load.
   links = the buttons on the card that slides out when you click the cover.
           Leave a link out (or '') and its button simply doesn't show.
           You can swap any of them for a push.fm / smart link later (add e.g.  pushfm: '...').
   ===================================================================== */
const R = 'assets/releases/';
window.RELEASES = [
  { artist: 'KVMPA',      title: 'STATIONS (EP)',   img: R + 'stations.webp',
    links: { spotify: 'https://open.spotify.com/album/2NdGBAzM9ENecCTGxG6lHD', apple: 'https://music.apple.com/us/album/stations-ep/1811662716', deezer: 'https://www.deezer.com/fr/album/750017991' } },
  { artist: 'RAMSJAMSSS', title: 'STOMP (VOL 1)',   img: R + 'stomp-1.webp', start: true,
    links: { spotify: 'https://open.spotify.com/album/3SVroqfmO5adB0kgIV4LYB', apple: 'https://music.apple.com/us/album/stomp-mixtape-vol-1/6790915606', deezer: 'https://www.deezer.com/fr/album/1029240262' } },
  { artist: 'SOUHA',      title: 'ASTHMA (EP)',     img: R + 'asthma-ep.webp',
    links: { spotify: 'https://open.spotify.com/album/1SXSaPs7i7XCm2RtbwmGgZ', apple: 'https://music.apple.com/us/album/asthma-single/6823661347', deezer: 'https://www.deezer.com/fr/album/670640031' } },
  { artist: 'RAMSJAMSSS', title: 'STOMP (VOL 2)',   img: R + 'stomp-2.webp',
    links: { spotify: 'https://open.spotify.com/album/5ncuEN6smjC43fkBaU9PDs', apple: 'https://music.apple.com/us/album/stomp-mixtape-vol-2/6821019077', deezer: 'https://www.deezer.com/fr/album/1117838252' } },
  { artist: 'RAMSJAMSSS', title: 'CONGRATULATIONS', img: R + 'congratulations.webp',
    links: { spotify: 'https://open.spotify.com/album/0u1TBTFd4hL8yzRHJYJsCh', apple: 'https://music.apple.com/us/album/congratulations/1824881635', deezer: 'https://link.deezer.com/s/34UxmJHJEowwVSLrjk8gZ' } },
  { artist: 'RAMSJAMSSS', title: 'TROPICO',         img: R + 'tropico.webp',
    links: { spotify: 'https://open.spotify.com/track/47KDoA5tSWUKA6r2RGAliy', apple: 'https://music.apple.com/us/album/tropico-single/1776766982', deezer: 'https://link.deezer.com/s/34UxmjSkDpL5a9HnEtWcA' } },
  { artist: 'RAMSJAMSSS', title: 'PTS',             img: R + 'pts.webp',
    links: { spotify: 'https://open.spotify.com/album/5xk7OVCet0YfuJpem4llxz', apple: 'https://music.apple.com/us/album/pts-single/1771936111', deezer: 'https://www.deezer.com/fr/album/651190421' } },
  { artist: 'RAMSJAMSSS', title: 'ON THE MAP',      img: R + 'on-the-map.webp',
    links: { spotify: 'https://open.spotify.com/album/6PU2Rvk4W19Y5b95ioj80b', apple: 'https://music.apple.com/us/album/on-the-map-single/6779293751', deezer: 'https://www.deezer.com/fr/album/1003490371' } },
  { artist: 'RAMSJAMSSS', title: 'KNOW YOUR PLACE', img: R + 'know-your-place.webp',
    links: { spotify: 'https://open.spotify.com/album/5MQNL1mGjPkIAiNIZOoFdI', apple: 'https://music.apple.com/fr/album/know-your-place-single/1789173644' } },
  { artist: 'RAMSJAMSSS', title: 'ICH LIEBE DICH',  img: R + 'ich-liebe-dich.webp',
    links: { spotify: 'https://open.spotify.com/album/30c3EAEfinsdn9pxtAuGVN', apple: 'https://music.apple.com/fr/album/ich-liebe-dich-single/1749193030' } },
  { artist: 'RAMSJAMSSS', title: 'IDOWHATIWANT',    img: R + 'idowhatiwant.webp',
    links: { spotify: 'https://open.spotify.com/album/4ObnbJ9MbrZOlhylVJHEPM', apple: 'https://music.apple.com/us/album/idowhatiwant-single/1707457603' } },
  { artist: 'RAMSJAMSSS', title: 'HOLD ON',         img: R + 'hold-on.webp',
    links: { spotify: 'https://open.spotify.com/track/4LBUnIjA9uSBnMiSvkSS2f', apple: 'https://music.apple.com/us/album/hold-on-single/1786021360', deezer: 'https://www.deezer.com/us/album/685471681' } },
  { artist: 'RAMSJAMSSS', title: 'HEAVY ON MY MIND', img: R + 'heavy-on-my-mind.webp',
    links: { spotify: 'https://open.spotify.com/track/6psjYCiGTMmFaFJ8NWDwhN', apple: 'https://music.apple.com/us/album/heavy-on-my-mind-single/1783774059', deezer: 'https://www.deezer.com/us/album/680095041' } },
  { artist: 'SOUHA',      title: 'EVEN IF I COULD', img: R + 'even-if-i-could.webp',
    links: { spotify: 'https://open.spotify.com/track/1ydXxJi5gXY1XhiY0fzAeb', apple: 'https://music.apple.com/fr/album/even-if-i-could-single/1778343933', deezer: 'https://www.deezer.com/mx/album/666594891' } },
  { artist: 'SOUHA',      title: 'CAN WE BE CLOSER', img: R + 'can-we-be-closer.webp',
    links: { spotify: 'https://open.spotify.com/track/4bsR3IoLchXe5KURX6q8Hy', apple: 'https://music.apple.com/us/album/can-we-be-closer-single/1778337883', deezer: 'https://www.deezer.com/us/album/666592021' } },
  { artist: 'RAMSJAMSSS', title: '2BUCKS',          img: R + '2bucks.webp',
    links: { spotify: 'https://open.spotify.com/track/3jNQCvj3Wp51Fz6TKLWA5L', apple: 'https://music.apple.com/id/album/2bucks-single/1749193143', youtube: 'https://www.youtube.com/watch?v=IwHWTe1snik' } },
];
