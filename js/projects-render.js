/* =============================================
   PROJECTS RENDER
   Strategy:
   - Always show the base projects from projects-data.js
   - Append any extra projects added via admin (stored in localStorage)
   - This means defaults are never lost even if the admin only saved
     a partial list.
   ============================================= */

function getActiveProjects() {
    const defaults = (typeof projectsData !== 'undefined') ? projectsData : [];

    const stored = localStorage.getItem('portfolioProjects');
    if (!stored) return defaults;

    try {
        const adminList = JSON.parse(stored);
        // Add only projects whose ID doesn't exist in defaults
        const defaultIds = new Set(defaults.map(p => p.id));
        const extras = adminList.filter(p => !defaultIds.has(p.id));
        return [...defaults, ...extras];
    } catch {
        return defaults;
    }
}

function renderCard(project, index) {
    const num = String(index).padStart(2, '0');
    const hasImages = project.images && project.images.length > 0;

    const imagesHtml = hasImages
        ? `<div class="carousel-thumbnails">
            ${project.images.map(img => `
              <div class="carousel-item">
                <img src="${img.src}" alt="${img.caption}" class="carousel-thumb" tabindex="0" loading="lazy" />
                <span class="carousel-thumb-size">${img.caption}</span>
              </div>`).join('')}
           </div>`
        : `<div class="project-placeholder">
             <span>&#128196;</span>
             <p>${project.title}</p>
           </div>`;

    const techHtml = (project.tech || [])
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');

    const dateHtml = project.date
        ? `<span class="project-date">&#128197; ${project.date}</span>`
        : '';

    const demoBtn = project.demo
        ? `<div class="projects__button">
             <a href="${project.demo}" target="_blank" rel="noopener" class="projects__button-link">Live Demo &#8599;</a>
           </div>`
        : '';

    return `
      <article class="projects__card">
        <div class="projects__number">
          <h1>${num}</h1>
          <div class="project-header-meta">
            ${dateHtml}
            <div class="projects__button">
              <img src="./assets/viewgithub.png" alt="GitHub" class="icon" loading="lazy" />
              <a href="${project.github}" target="_blank" rel="noopener" class="projects__button-link">GitHub</a>
            </div>
            ${demoBtn}
          </div>
        </div>
        <div class="projects__data">
          <h2 class="projects__title">${project.title}</h2>
          <div class="tech-tags">${techHtml}</div>
          <p class="projects__description projects__desc-body">${project.longDescription || project.description}</p>
        </div>
        <div class="projects__image ${hasImages ? '' : 'projects__image--placeholder'}">
          ${imagesHtml}
        </div>
      </article>`;
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const list = getActiveProjects();

    if (!list.length) {
        grid.innerHTML = '<p class="no-projects">No projects yet — check back soon!</p>';
        return;
    }

    grid.innerHTML = list.map((p, i) => renderCard(p, i + 1)).join('');
}

document.addEventListener('DOMContentLoaded', renderProjects);
