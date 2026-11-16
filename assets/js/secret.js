// Secret page. Loaded by secret/index.md.
(function () {
'use strict';

async function decrypt() {
  const pw = document.getElementById('pw').value;
  const enc = await fetch('secret.enc').then(r => r.text());
  try {
    const bytes = CryptoJS.AES.decrypt(enc, pw);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    if (!text) throw new Error();
    document.getElementById('output').textContent = text;
  } catch {
    document.getElementById('output').textContent = "Incorrect password.";
  }
}
document.getElementById('unlock').onclick = decrypt;

})();
