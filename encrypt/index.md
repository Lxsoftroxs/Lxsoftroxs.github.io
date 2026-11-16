---
layout: post
title: Encrypt Text
permalink: /encrypt/
---

# 🧩 Encrypt Text for the Secret Section

Paste text below and enter a password.  
This page runs entirely in your browser — nothing is uploaded or stored anywhere.

<textarea id="plain" placeholder="Write or paste your text here..."></textarea><br>
<input id="pw" type="password" placeholder="Password"><br>
<button id="encrypt-btn">Encrypt</button>

<h3>Encrypted Output</h3>
<textarea id="out" readonly></textarea>

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
<script defer src="{{ '/assets/js/encrypt.js' | relative_url }}"></script>
