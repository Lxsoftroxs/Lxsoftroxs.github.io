---
layout: page
title: Secret Section
permalink: /secret/
---

# 🔒 Secret Section

Enter your password to view the encrypted content.  
This runs completely in your browser — no data ever leaves your device.

<div id="decryptor">
  <input id="pw" type="password" placeholder="Password">
  <button id="unlock">Unlock</button>
  <pre id="output"></pre>
</div>

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
<script>
async function decrypt() {
  const pw = document.getElementById('pw').value;
  const enc = await fetch('secret.enc').then(r => r.text());
  try {
    const bytes = CryptoJS.AES.decrypt(enc, pw);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    if (!text) throw new Error();
    document.getElementById('output').textContent = text;
  } catch {
    document.getElementById('output').textContent = "❌ Incorrect password.";
  }
}
document.getElementById('unlock').onclick = decrypt;
</script>
