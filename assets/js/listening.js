(function () {
  const cfg = document.getElementById('lastfm-config');
  if (!cfg) return;

  const LASTFM_USER  = cfg.dataset.user;
  const LASTFM_KEY   = cfg.dataset.key;
  const LIMIT        = 50;
  const REFRESH_MS   = 60_000;
  const SIZE_INDEX   = 3;

  const $now  = document.getElementById('now-playing');
  const $list = document.getElementById('recent-list');

  function imgOf(track) {
    const images = track.image || [];
    const pick = images[Math.min(SIZE_INDEX, images.length - 1)];
    return (pick && pick['#text']) ||
      'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
  }

  function whenText(track) {
    if (track['@attr'] && track['@attr'].nowplaying) {
      return '<span class="badge">Now Playing</span>';
    }
    const uts = track.date?.uts ? parseInt(track.date.uts, 10) * 1000 : null;
    if (!uts) return '';
    return new Date(uts).toLocaleString();
  }

  function rowHTML(track) {
    const artist = track.artist?.['#text'] || '';
    const title  = track.name || '';
    const url    = track.url || '#';
    return `
      <div class="listen-row">
        <img alt="album art" src="${imgOf(track)}">
        <div>
          <div><a href="${url}" target="_blank" rel="noopener"><b>${title}</b></a></div>
          <div class="listen-meta">${artist}</div>
          <div class="listen-meta">${whenText(track)}</div>
        </div>
      </div>
    `;
  }

  async function loadRecent() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks` +
        `&user=${encodeURIComponent(LASTFM_USER)}&api_key=${LASTFM_KEY}` +
        `&format=json&limit=${LIMIT}`;
      const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      const tracks = data?.recenttracks?.track || [];

      const np = tracks.find(t => t['@attr'] && t['@attr'].nowplaying);
      if (np) {
        $now.style.display = '';
        $now.innerHTML = rowHTML(np);
      } else {
        $now.style.display = 'none';
      }

      const recent = tracks.filter(t => !(t['@attr'] && t['@attr'].nowplaying));
      $list.innerHTML = recent.map(rowHTML).join('');
    } catch (e) {
      clearTimeout(timeout);
      $now.style.display = '';
      if (e.name === 'AbortError') {
        $now.innerHTML = '<div>Last.fm timed out. Try refreshing.</div>';
      } else {
        $now.innerHTML = "<div>Couldn't load Last.fm feed.</div>";
      }
    }
  }

  loadRecent();
  setInterval(loadRecent, REFRESH_MS);
})();
