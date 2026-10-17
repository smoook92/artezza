import {
    addToCart,
    getCartQuantity,
} from '../core/cart.js';

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
            
            <button
                class="catalog-product__add-to-cart button button--primary button--small"
                type="button"
                data-product-id="${escapeHtml(product.id)}"
            >
                В корзину
            </button>
            
            <a
                class="catalog-product__link"
                href="${escapeHtml(product.url)}"
            >
                Подробнее
                <span aria-hidden="true">↗</span>
            </a>

        </div>
    `;

    const addButton = article.querySelector(
        '.catalog-product__add-to-cart'
    );
    
    addButton?.addEventListener('click', () => {
        addToCart(product.id);
    
        addButton.textContent = 'Добавлено в корзину';
        addButton.classList.add('is-added');
    
        document
            .querySelectorAll('[data-cart-count]')
            .forEach((badge) => {
                badge.textContent = String(getCartQuantity());
            });
    
        window.setTimeout(() => {
            addButton.textContent = 'В корзину';
            addButton.classList.remove('is-added');
        }, 1500);
    });
    
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
