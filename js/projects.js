/* Image modal — event delegation works for dynamically rendered thumbnails */

document.addEventListener('DOMContentLoaded', function () {
    const modal    = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('closeModal');
    if (!modal) return;

    let lastFocused = null;

    function openModal(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt;
        modal.classList.add('active');
        lastFocused = document.activeElement;
        closeBtn.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modalImg.src = '';
        modalImg.alt = '';
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    /* Delegate clicks — catches thumbnails added after page load */
    document.addEventListener('click', e => {
        if (e.target.classList.contains('carousel-thumb')) {
            openModal(e.target.src, e.target.alt);
            return;
        }
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.target.classList.contains('carousel-thumb') &&
            (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            openModal(e.target.src, e.target.alt);
        }
        if (modal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
            closeModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeModal(); }
    });
});
