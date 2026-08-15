document.addEventListener('DOMContentLoaded', loadIncludes);

/**
 * Загружает HTML-компоненты страницы.
 *
 * @returns {Promise<void>}
 */
async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');

    await Promise.all(
        [...includes].map(loadInclude)
    );
}

/**
 * Загружает отдельный HTML-компонент.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
async function loadInclude(element) {
    const name = element.dataset.include;

    if (!name) {
        return;
    }

    try {
        const response = await fetch(
            `includes/${name}.html`
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(
            `Ошибка загрузки include "${name}":`,
            error
        );
    }
}