/**
 * Загружает HTML-компонент в указанный элемент.
 *
 * @param {string} selector
 * @param {string} url
 * @returns {Promise<void>}
 */
async function include(selector, url) {
    const container = document.querySelector(selector);

    if (!container) {
        return;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Не удалось загрузить компонент: ${url}`
            );
        }

        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}


/**
 * Загружает общие HTML-компоненты страницы.
 *
 * @returns {Promise<void>}
 */
export async function loadComponents() {
    await Promise.all([
        include(
            '[data-include="header"]',
            'components/header.html'
        ),
        include(
            '[data-include="footer"]',
            'components/footer.html'
        ),
    ]);
}