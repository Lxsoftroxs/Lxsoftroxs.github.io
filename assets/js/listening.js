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
      return { text: 'Now Playing', isBadge: true };
    }
    const uts = track.date?.uts ? parseInt(track.date.uts, 10) * 1000 : null;
    if (!uts) return { text: '', isBadge: false };
    return { text: new Date(uts).toLocaleString(), isBadge: false };
  }

  function buildRow(track) {
    const artist = track.artist?.['#text'] || '';
    const title  = track.name || '';
    const url    = track.url || '#';
    const time = whenText(track);

    const row = document.createElement('div');
    row.className = 'listen-row';

    const image = document.createElement('img');
    image.alt = 'album art';
    image.src = imgOf(track);
    row.appendChild(image);

    const info = document.createElement('div');

    const titleWrap = document.createElement('div');
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    const bold = document.createElement('b');
    bold.textContent = title;
    link.appendChild(bold);
    titleWrap.appendChild(link);
    info.appendChild(titleWrap);

    const artistEl = document.createElement('div');
    artistEl.className = 'listen-meta';
    artistEl.textContent = artist;
    info.appendChild(artistEl);

    const timeEl = document.createElement('div');
    timeEl.className = 'listen-meta';
    if (time.isBadge) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = time.text;
      timeEl.appendChild(badge);
    } else {
      timeEl.textContent = time.text;
    }
    info.appendChild(timeEl);

    row.appendChild(info);
    return row;
  }

  function renderRows(container, tracks) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    tracks.forEach((track) => fragment.appendChild(buildRow(track)));
    container.appendChild(fragment);
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
        renderRows($now, [np]);
      } else {
        $now.style.display = 'none';
        $now.innerHTML = '';
      }

      const recent = tracks.filter(t => !(t['@attr'] && t['@attr'].nowplaying));
      renderRows($list, recent);
    } catch (e) {
      clearTimeout(timeout);
      $now.style.display = '';
      $now.innerHTML = '';
      const message = document.createElement('div');
      if (e.name === 'AbortError') {
        message.textContent = 'Last.fm timed out. Try refreshing.';
      } else {
        message.textContent = "Couldn't load Last.fm feed.";
      }
      $now.appendChild(message);
    }
  }

  loadRecent();
  setInterval(loadRecent, REFRESH_MS);
})();
