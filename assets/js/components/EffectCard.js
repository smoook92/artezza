/**
 * Создаёт карточку декоративного эффекта.
 *
 * @param {Object} effect
 * @param {string} effect.id
 * @param {string} effect.name
 * @param {string} effect.description
 * @param {string} effect.image
 * @returns {HTMLElement}
 */
export function createEffectCard(effect) {
    const article = document.createElement('article');

    article.className = 'effect-card';

    article.innerHTML = `
        <a
            class="effect-card__anchor"
            href="effect.html?id=${encodeURIComponent(effect.id)}"
        >
            <div class="effect-card__image-wrapper">
                <img
                    class="effect-card__image"
                    src="${escapeHtml(effect.image)}"
                    alt="${escapeHtml(effect.name)}"
                    width="800"
                    height="600"
                    loading="lazy"
                >
            </div>

            <div class="effect-card__content">
                <h2 class="effect-card__title">
                    ${escapeHtml(effect.name)}
                </h2>

                <p class="effect-card__description">
                    ${escapeHtml(effect.description)}
                </p>

                <span class="effect-card__link-text">
                    Смотреть эффект
                    <span aria-hidden="true">→</span>
                </span>
            </div>
        </a>
    `;

    return article;
}


/**
 * Генерирует список эффектов в меню.
 *
 * @param {HTMLElement|null} container
 * @param {Array} effects
 * @returns {void}
 */
export function renderEffectsMenu(container, effects) {
    if (!container) {
        return;
    }

    container.replaceChildren();

    effects.forEach((effect) => {
        const link = document.createElement('a');

        link.className = 'site-header__dropdown-item';
        link.href = `effect.html?id=${encodeURIComponent(effect.id)}`;
        link.textContent = effect.name;

        container.appendChild(link);
    });
}


/**
 * Экранирует значение перед вставкой в HTML.
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