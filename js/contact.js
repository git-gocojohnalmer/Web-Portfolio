/* Contact Form — validation, char counter, success state */

const form = document.getElementById('contactForm');
const successPanel = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const messageField = document.getElementById('message');
const charCountEl = document.getElementById('charCount');

/* Character counter */
if (messageField && charCountEl) {
    messageField.addEventListener('input', () => {
        const len = messageField.value.length;
        const max = parseInt(messageField.getAttribute('maxlength'), 10) || 500;
        charCountEl.textContent = `${len} / ${max}`;
        charCountEl.classList.toggle('warn', len > max * 0.8);
        charCountEl.classList.toggle('limit', len >= max);
    });
}

/* Field validation helpers */
function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(errorId);
    if (!field || !errEl) return false;
    field.classList.add('error');
    field.classList.remove('valid');
    errEl.textContent = message;
    return false;
}

function setValid(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(errorId);
    if (!field || !errEl) return true;
    field.classList.remove('error');
    field.classList.add('valid');
    errEl.textContent = '';
    return true;
}

function validateForm() {
    let valid = true;

    const name = document.getElementById('name').value.trim();
    if (!name) {
        setError('name', 'nameError', 'Please enter your name.');
        valid = false;
    } else {
        setValid('name', 'nameError');
    }

    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        setError('email', 'emailError', 'Please enter your email address.');
        valid = false;
    } else if (!emailRegex.test(email)) {
        setError('email', 'emailError', 'Please enter a valid email address.');
        valid = false;
    } else {
        setValid('email', 'emailError');
    }

    const subject = document.getElementById('subject').value.trim();
    if (!subject) {
        setError('subject', 'subjectError', 'Please enter a subject.');
        valid = false;
    } else {
        setValid('subject', 'subjectError');
    }

    const message = document.getElementById('message').value.trim();
    if (!message) {
        setError('message', 'messageError', 'Please enter a message.');
        valid = false;
    } else if (message.length < 10) {
        setError('message', 'messageError', 'Message must be at least 10 characters.');
        valid = false;
    } else {
        setValid('message', 'messageError');
    }

    return valid;
}

/* Submit */
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-submit-text').textContent = 'Sending…';

        /* Simulate async send (replace with real API call if needed) */
        setTimeout(() => {
            form.style.display = 'none';
            successPanel.classList.add('visible');
            submitBtn.classList.remove('loading');
        }, 1200);
    });

    /* Inline validation on blur */
    ['name', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => {
            if (el.value.trim()) {
                el.classList.add('valid');
                el.classList.remove('error');
                document.getElementById(id + 'Error').textContent = '';
            }
        });
    });
}

/* Reset to form after success */
function resetForm() {
    form.reset();
    form.style.display = 'flex';
    successPanel.classList.remove('visible');
    submitBtn.querySelector('.btn-submit-text').textContent = 'Send Message';
    if (charCountEl) charCountEl.textContent = '0 / 500';
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
        el.classList.remove('valid', 'error');
    });
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}
