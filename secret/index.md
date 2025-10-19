---
layout: page
title: Secret Section
permalink: /secret/
secrets:
  - title: Hidden Transmission
    file: secret.enc
    hint: "Password from the original clue."
  - title: Starlight Archive
    file: starlight.enc
    hint: "Try the phase of the moon."
---

# Woah Watch Where You Click Buddy

Unlock each transmission with its own password. Generate new encrypted files with the [Encrypt]({{ '/encrypt/' | relative_url }}) tool, drop the output into the `secret/` folder, and copy one of the front matter entries to register it with the list below.

<div class="secret-list">
  {% for secret in page.secrets %}
  <section class="secret-item" data-file="{{ ('/secret/' | append: secret.file) | relative_url }}">
    <h2 class="secret-title">{{ secret.title }}</h2>
    {% if secret.hint %}
    <p class="secret-hint">{{ secret.hint }}</p>
    {% endif %}
    <div class="secret-controls">
      <label class="sr-only" for="pw-{{ forloop.index }}">Password for {{ secret.title }}</label>
      <input id="pw-{{ forloop.index }}" class="secret-password" type="password" placeholder="Password">
      <button type="button" class="secret-unlock">Unlock</button>
    </div>
    <pre class="secret-output" aria-live="polite"></pre>
  </section>
  {% endfor %}
</div>

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var sections = document.querySelectorAll('.secret-item');
  sections.forEach(function (section) {
    var file = section.dataset.file;
    var passwordInput = section.querySelector('.secret-password');
    var unlockButton = section.querySelector('.secret-unlock');
    var output = section.querySelector('.secret-output');
    var cachedCipher = null;

    async function getCipher() {
      if (cachedCipher) {
        return cachedCipher;
      }
      var response = await fetch(file);
      if (!response.ok) {
        throw new Error('missing-file');
      }
      cachedCipher = await response.text();
      return cachedCipher;
    }

    async function attemptDecrypt() {
      var password = passwordInput.value;
      if (!password) {
        output.textContent = 'Enter a password to unlock this file.';
        return;
      }

      output.textContent = 'Decrypting…';

      try {
        var cipher = await getCipher();
        var bytes = CryptoJS.AES.decrypt(cipher, password);
        var text = bytes.toString(CryptoJS.enc.Utf8);
        if (!text) {
          throw new Error('bad-password');
        }
        output.textContent = text;
      } catch (err) {
        if (err.message === 'bad-password') {
          output.textContent = 'Incorrect password.';
        } else if (err.message === 'missing-file') {
          output.textContent = 'Encrypted file is missing from the build.';
        } else {
          output.textContent = 'Something went wrong while decrypting.';
        }
      }
    }

    unlockButton.addEventListener('click', attemptDecrypt);
    passwordInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        attemptDecrypt();
      }
    });
  });
});
</script>
