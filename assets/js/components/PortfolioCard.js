/**
 * Создаёт карточку работы портфолио.
 *
 * @param {Object} project
 * @param {string} project.id
 * @param {string} project.title
 * @param {string} project.category
 * @param {string} project.description
 * @param {string} project.image
 * @returns {HTMLElement}
 */
export function createPortfolioCard(project) {
    const article = document.createElement('article');

    article.className = 'portfolio-card';

    article.innerHTML = `
        <a
            class="portfolio-card__link"
            href="portfolio-single.html?id=${encodeURIComponent(project.id)}"
        >
            <div class="portfolio-card__image-wrapper">
                <img
                    class="portfolio-card__image"
                    src="${escapeHtml(project.image)}"
                    alt="${escapeHtml(project.title)}"
                    width="1200"
                    height="900"
                    loading="lazy"
                >
            </div>

            <div class="portfolio-card__content">
                <span class="portfolio-card__category">
                    ${escapeHtml(project.category)}
                </span>

                <h2 class="portfolio-card__title">
                    ${escapeHtml(project.title)}
                </h2>

                <p class="portfolio-card__description">
                    ${escapeHtml(project.description)}
                </p>

                <span class="portfolio-card__link-text">
                    Смотреть работу
                    <span aria-hidden="true">↗</span>
                </span>
            </div>
        </a>
    `;

    return article;
}


/**
 * Безопасно экранирует значение перед вставкой в HTML.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}