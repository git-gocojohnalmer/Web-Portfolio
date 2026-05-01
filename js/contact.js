/* Contact Form — validation, char counter, Formspree submission
 *
 * TO ACTIVATE: sign up at https://formspree.io, create a form,
 * then paste your form ID below (the part after /f/).
 */
const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace with your Formspree form ID

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

/* Validation helpers */
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

function showSuccess() {
    form.style.display = 'none';
    successPanel.classList.add('visible');
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('.btn-submit-text').textContent = 'Send Message';
}

function showError(msg) {
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('.btn-submit-text').textContent = 'Send Message';
    const errEl = document.getElementById('messageError');
    if (errEl) errEl.textContent = msg || 'Something went wrong. Please try again.';
}

/* Submit */
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-submit-text').textContent = 'Sending…';

        if (FORMSPREE_ID === 'YOUR_FORM_ID') {
            /* No Formspree ID set — demo mode: show success after delay */
            setTimeout(showSuccess, 1200);
            return;
        }

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showSuccess();
            } else {
                const data = await response.json();
                const msg = data?.errors?.map(e => e.message).join(', ');
                showError(msg);
            }
        } catch {
            showError('Network error — please email me directly.');
        }
    });

    /* Inline validation on blur */
    ['name', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => {
            if (el.value.trim()) {
                el.classList.add('valid');
                el.classList.remove('error');
                const errEl = document.getElementById(id + 'Error');
                if (errEl) errEl.textContent = '';
            }
        });
    });
}

/* Reset to form view after success */
function resetForm() {
    form.reset();
    form.style.display = 'flex';
    successPanel.classList.remove('visible');
    if (charCountEl) charCountEl.textContent = '0 / 500';
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
        el.classList.remove('valid', 'error');
    });
    document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
}
