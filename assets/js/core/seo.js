/**
 * Устанавливает canonical URL динамической страницы.
 *
 * @param {string} parameter
 * @param {string} value
 * @returns {void}
 */
export function setCanonicalUrl(parameter, value) {
    const url = new URL(window.location.href);

    url.search = '';
    url.searchParams.set(parameter, value);
    url.hash = '';

    let canonical = document.querySelector(
        'link[rel="canonical"]'
    );

    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }

    canonical.href = url.href;
}