document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('comment-form');
  if (!form) return;

  const submitButton = document.getElementById('submit-button');
  const formMessage = document.getElementById('form-message');
  const commentText = document.getElementById('comment-text');
  const charCount = document.getElementById('char-count');

  // Character counter — color + text so color-blind users still get the warning
  const charWarning = document.createElement('span');
  charWarning.setAttribute('aria-live', 'polite');
  charWarning.style.marginLeft = '0.5rem';
  charWarning.style.fontSize = '0.8rem';
  charCount.parentNode.appendChild(charWarning);

  commentText.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length;
    if (length >= 1000) {
      charCount.style.color = '#ff6b6b';
      charWarning.textContent = '(limit reached)';
    } else if (length >= 800) {
      charCount.style.color = '#ffa500';
      charWarning.textContent = '(approaching limit)';
    } else {
      charCount.style.color = '#888';
      charWarning.textContent = '';
    }
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Check honeypot
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      showMessage('Thank you for your submission!', 'success');
      form.reset();
      return;
    }

    const name = document.getElementById('comment-name').value.trim();
    const comment = commentText.value.trim();

    if (!comment) {
      showMessage('Please enter a message.', 'error');
      return;
    }

    const sanitizedName = sanitizeInput(name || 'Anonymous');
    const sanitizedComment = sanitizeInput(comment);

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    formMessage.style.display = 'none';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://subscriber-api-lolroxs.vercel.app/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sanitizedName,
          comment: sanitizedComment,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        showMessage('Thank you! Your comment has been submitted and will appear after review.', 'success');
        form.reset();
        charCount.textContent = '0';
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        showMessage('Request timed out. Please try again.', 'error');
      } else {
        showMessage('Sorry, there was an error submitting your comment. Please try again later.', 'error');
      }
      console.error('Submission error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Comment';
    }
  });

  function sanitizeInput(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .substring(0, 1000);
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    if (type === 'success') {
      setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
    }
  }
});
