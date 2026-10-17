/**
 * Создаёт карточку товара.
 *
 * @param {Object} product
 * @param {string} product.id
 * @param {string} product.url
 * @param {string} product.image
 * @param {string} product.alt
 * @param {string} product.title
 * @param {string} product.description
 * @param {string} [product.categoryName]
 * @param {string} [product.category]
 * @returns {HTMLElement}
 */
export function createCatalogProduct(product) {
    const article = document.createElement('article');

    article.className = 'catalog-product';

    const categoryName =
        product.categoryName ??
        product.category ??
        '';

    const formattedPrice =
        Number.isFinite(Number(product.price)) && Number(product.price) > 0
            ? `${new Intl.NumberFormat('ru-RU').format(Number(product.price))} ₽`
            : '';

    article.innerHTML = `
        <a
            class="catalog-product__media"
            href="${escapeHtml(product.url)}"
            aria-label="${escapeHtml(product.title)}"
        >
            <img
                src="${escapeHtml(product.image)}"
                alt="${escapeHtml(product.alt ?? product.title)}"
                loading="lazy"
                width="600"
                height="600"
            >
        </a>

        <div class="catalog-product__content">

            ${
                categoryName
                    ? `
                        <span class="catalog-product__category">
                            ${escapeHtml(categoryName)}
                        </span>
                    `
                    : ''
            }

            <h2 class="catalog-product__title">
                ${escapeHtml(product.title)}
            </h2>

            <p class="catalog-product__description">
                ${escapeHtml(product.description)}
            </p>
            
            ${
                formattedPrice
                    ? `
                        <p class="catalog-product__price">
                            ${escapeHtml(formattedPrice)}
                        </p>
                    `
                    : ''
            }
            
            <a
                class="catalog-product__link"
                href="${escapeHtml(product.url)}"
            >
                Подробнее
                <span aria-hidden="true">↗</span>
            </a>

        </div>
    `;

    return article;
}


/**
 * Экранирует значение перед вставкой в HTML.
 *
 * @param {unknown} value
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
