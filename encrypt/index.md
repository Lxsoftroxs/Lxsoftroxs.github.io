---
layout: page
title: Encrypt Text
permalink: /encrypt/
---

# 🧩 Encrypt Text for the Secret Section

Paste text below and enter a password.  
This page runs entirely in your browser — nothing is uploaded or stored anywhere.

<textarea id="plain" placeholder="Write or paste your text here..."></textarea><br>
<input id="pw" type="password" placeholder="Password"><br>
<button onclick="encrypt()">Encrypt</button>

<h3>Encrypted Output</h3>
<textarea id="out" readonly></textarea>

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
<script>
function encrypt() {
  const plain = document.getElementById('plain').value;
  const pw = document.getElementById('pw').value;
  if (!plain || !pw) {
    alert("Please enter both text and password.");
    return;
  }
  const cipher = CryptoJS.AES.encrypt(plain, pw).toString();
  document.getElementById('out').value = cipher;
}
</script>
