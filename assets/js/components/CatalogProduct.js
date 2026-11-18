
import {
    addToCart,
    getCartQuantity,
} from '../core/cart.js';

const FALLBACK_IMAGE = 'assets/images/catalog/decorative-plaster.jpg';

/**
 * Создаёт карточку товара.
 *
 * @param {Object} product
 * @returns {HTMLElement|null}
 */
export function createCatalogProduct(product) {
    if (
        !product ||
        typeof product !== 'object' ||
        !product.id ||
        !product.title ||
        !product.url ||
        !product.image ||
        !product.description
    ) {
        console.error('Некорректные данные товара:', product);
        return null;
    }

    const article = document.createElement('article');
    article.className = 'catalog-product';

    const categoryName =
        product.categoryName ??
        product.category ??
        '';

    const price = Number(product.price);

    const hasVolumeOptions = Array.isArray(product.volumeOptions)
        && product.volumeOptions.length > 0;

    const buttonLabel = hasVolumeOptions
        ? 'Выбрать объём'
        : 'В корзину';

    const formattedPrice = Number.isFinite(price) && price > 0
        ? `${new Intl.NumberFormat('ru-RU').format(price)} ₽`
        : '';

    const productUrl = getSafeUrl(product.url);
    const imageUrl = getSafeUrl(product.image);

    if (!productUrl) {
        console.error('Некорректный URL товара:', product.url);
        return null;
    }

    article.innerHTML = `
        <a
            class="catalog-product__media"
            href="${escapeHtml(productUrl)}"
            aria-label="${escapeHtml(product.title)}"
        >
            <img
                src="${escapeHtml(imageUrl || FALLBACK_IMAGE)}"
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

            <div class="catalog-product__purchase">
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
                    ${buttonLabel}
                </button>
            </div>

            <a
                class="catalog-product__link"
                href="${escapeHtml(productUrl)}"
            >
                Подробнее
                <span aria-hidden="true">↗</span>
            </a>
        </div>
    `;

    const addButton = article.querySelector(
        '.catalog-product__add-to-cart'
    );

    let resetTimer = null;

    addButton.addEventListener('click', () => {
        if (hasVolumeOptions) {
            window.location.href = productUrl;
            return;
        }

        const productId = addButton.dataset.productId;
        const isAdded = addToCart(productId);

        window.clearTimeout(resetTimer);

        if (isAdded) {
            addButton.textContent = 'Добавлено в корзину';
            addButton.classList.add('is-added');

            document
                .querySelectorAll('[data-cart-count]')
                .forEach((badge) => {
                    badge.textContent = String(getCartQuantity());
                });
        } else {
            addButton.textContent = 'Не удалось добавить';
            addButton.classList.remove('is-added');
        }

        resetTimer = window.setTimeout(() => {
            addButton.textContent = buttonLabel;
            addButton.classList.remove('is-added');
        }, 1500);
    });

    const image = article.querySelector('img');

    image.addEventListener('error', () => {
        image.onerror = null;
        image.src = FALLBACK_IMAGE;
    });

    return article;
}

/**
 * Проверяет URL и разрешает только HTTP(S).
 *
 * @param {string} value
 * @returns {string|null}
 */
function getSafeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }

    try {
        const url = new URL(value, window.location.origin);

        if (!['http:', 'https:'].includes(url.protocol)) {
            return null;
        }

        return value;
    } catch {
        return null;
    }
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
