// Encrypt page. Loaded by encrypt/index.md.
(function () {
'use strict';

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

document.getElementById('encrypt-btn').addEventListener('click', encrypt);

})();
