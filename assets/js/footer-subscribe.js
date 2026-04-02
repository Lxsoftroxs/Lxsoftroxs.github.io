document.addEventListener('DOMContentLoaded', function () {
  const form  = document.getElementById('subscribe-form');
  if (!form) return;
  const input = document.getElementById('subscriber-email');
  const honey = document.getElementById('website');
  const msg   = document.getElementById('subscribe-message');
  const btn   = form.querySelector('button');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (input.value || '').trim().toLowerCase();

    if (honey && honey.value) return; // bot
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.textContent = 'Please enter a valid email address.';
      return;
    }

    btn.disabled = true;
    msg.textContent = 'Subscribing...';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch('https://subscriber-api-lolroxs.vercel.app/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal
      });
      clearTimeout(timeout);

      let data = null;
      try { data = await res.json(); } catch (_) {}

      if (!res.ok) throw new Error((data && data.message) || `HTTP ${res.status}`);

      msg.textContent = (data && data.message) || 'Subscribed!';
      input.value = '';
    } catch (err) {
      clearTimeout(timeout);
      console.error(err);
      if (err.name === 'AbortError') {
        msg.textContent = 'Request timed out. Please try again.';
      } else {
        msg.textContent = 'Subscription failed. Please try again later.';
      }
    } finally {
      btn.disabled = false;
    }
  });
});
