import { initHeader } from '../components/header.js';
import { getCatalogData } from '../data/catalog-data.js';

import {
    addToCart,
    getCartQuantity,
} from '../core/cart.js';

document.addEventListener(
    'DOMContentLoaded',
    initHeader
);

document.addEventListener(
    'DOMContentLoaded',
    initProduct
);

/**
 * Initializes the product page.
 *
 * @returns {Promise<void>}
 */
async function initProduct() {
    const productId = getProductId();

    if (!productId) {
        renderProductNotFound();
        return;
    }

    try {
        const catalogData = await getCatalogData();

        const product = catalogData.products.find(
            (item) => item.id === productId
        );

        if (!product) {
            renderProductNotFound();
            return;
        }

        renderProduct(
            product,
            catalogData.categories
        );

        updateCartBadge();
    } catch (error) {
        console.error(
            'Failed to load product data:',
            error
        );

        renderProductNotFound();
    }
}

/**
 * Returns product ID from URL.
 *
 * @returns {string|null}
 */
function getProductId() {
    return new URLSearchParams(
        window.location.search
    ).get('id');
}

/**
 * Converts internal catalog values into readable Russian labels.
 *
 * @param {string} value
 * @returns {string}
 */
function formatProductValue(value) {
    const labels = {
        water: 'Водная',
        lime: 'Известковая',
        cement: 'Цементная',
        other: 'Другое',

        walls: 'Стены',
        floor: 'Пол',
        ceiling: 'Потолок',
        interior: 'Интерьер',
        exterior: 'Экстерьер',

        marble: 'Мрамор',
        gloss: 'Глянец',
        texture: 'Фактура',
        concrete: 'Бетон',
        decorative: 'Декоративный',
    };

    return labels[value] ?? value;
}

/**
 * Formats a list of catalog values.
 *
 * @param {Array<string>} values
 * @returns {string}
 */
function formatProductValues(values) {
    return values
        .map(formatProductValue)
        .join(', ');
}

/**
 * Renders product data.
 *
 * @param {Object} product
 * @param {Array} categories
 * @returns {void}
 */
function renderProduct(product, categories) {
    const categoryName =
        categories.find(
            (category) =>
                category.id === product.category
        )?.name ?? product.category;

    document.title = `${product.title} — Краски и Лепнина`;

    updateMetaDescription(product.description);

    setText(
        '.product__category',
        categoryName
    );

    setText(
        '.product__title',
        product.title
    );

    setText(
        '.product__description',
        product.shortDescription
    );

    setText(
        '.product__price',
        `${product.price.toLocaleString('ru-RU')} ₽`
    );

    setText(
        '.product__base',
        formatProductValue(product.base)
    );
    
    setText(
        '.product__applications',
        formatProductValues(product.applications ?? []) || '—'
    );
    
    setText(
        '.product__effects',
        formatProductValues(product.effects ?? []) || '—'
    );

    renderMainImage(product);
    renderGallery(product);
    renderCharacteristics(product);
    updateBreadcrumb(product);
    initAddToCart(product);
}

/**
 * Renders main product image.
 *
 * @param {Object} product
 * @returns {void}
 */
function renderMainImage(product) {
    const image = document.querySelector(
        '.product__image'
    );

    if (!image) {
        return;
    }

    image.src = product.image;
    image.alt = product.alt ?? product.title;
}

/**
 * Renders product gallery.
 *
 * @param {Object} product
 * @returns {void}
 */
function renderGallery(product) {
    const container = document.querySelector(
        '.product__thumbnails'
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    const gallery = product.gallery?.length
        ? product.gallery
        : [product.image];

    gallery.forEach((image, index) => {
        const button =
            document.createElement('button');

        button.type = 'button';
        button.className = 'product__thumbnail';

        button.setAttribute(
            'aria-label',
            `Показать изображение ${index + 1}`
        );

        button.setAttribute(
            'aria-pressed',
            String(index === 0)
        );

        if (index === 0) {
            button.classList.add('is-active');
        }

        const thumbnail =
            document.createElement('img');

        thumbnail.src = image;
        thumbnail.alt =
            `${product.title} — изображение ${index + 1}`;

        thumbnail.width = 100;
        thumbnail.height = 100;
        thumbnail.loading =
            index === 0 ? 'eager' : 'lazy';

        button.appendChild(thumbnail);

        button.addEventListener(
            'click',
            () => {
                setActiveGalleryImage(
                    image,
                    product,
                    button
                );
            }
        );

        container.appendChild(button);
    });
}

/**
 * Changes active gallery image.
 *
 * @param {string} image
 * @param {Object} product
 * @param {HTMLButtonElement} activeButton
 * @returns {void}
 */
function setActiveGalleryImage(
    image,
    product,
    activeButton
) {
    const mainImage = document.querySelector(
        '.product__image'
    );

    if (!mainImage) {
        return;
    }

    mainImage.src = image;
    mainImage.alt =
        product.alt ?? product.title;

    document
        .querySelectorAll('.product__thumbnail')
        .forEach((button) => {
            const isActive =
                button === activeButton;

            button.classList.toggle(
                'is-active',
                isActive
            );

            button.setAttribute(
                'aria-pressed',
                String(isActive)
            );
        });
}

/**
 * Renders product characteristics.
 *
 * @param {Object} product
 * @returns {void}
 */
function renderCharacteristics(product) {
    const container = document.querySelector(
        '.product-details__list'
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    product.characteristics?.forEach(
        ({ name, value }) => {
            const nameElement =
                document.createElement('dt');

            const valueElement =
                document.createElement('dd');

            nameElement.textContent = name;
            valueElement.textContent = value;

            container.append(
                nameElement,
                valueElement
            );
        }
    );
}

/**
 * Initializes add-to-cart button.
 *
 * @param {Object} product
 * @returns {void}
 */
function initAddToCart(product) {
    const button = document.querySelector(
        '.product__add-to-cart'
    );

    if (!button) {
        return;
    }

    button.addEventListener('click', () => {
        addToCart(product.id);

        button.textContent =
            'Добавлено в корзину';

        button.classList.add('is-added');

        updateCartBadge();

        window.setTimeout(() => {
            button.textContent =
                'Добавить в корзину';

            button.classList.remove('is-added');
        }, 1500);
    });
}

/**
 * Updates cart badge in header.
 *
 * @returns {void}
 */
function updateCartBadge() {
    const quantity = getCartQuantity();

    document
        .querySelectorAll('[data-cart-count]')
        .forEach((badge) => {
            badge.textContent = String(quantity);
        });
}

/**
 * Updates product breadcrumb.
 *
 * @param {Object} product
 * @returns {void}
 */
function updateBreadcrumb(product) {
    setText(
        '.product-breadcrumbs__current',
        product.title
    );
}

/**
 * Updates meta description.
 *
 * @param {string} description
 * @returns {void}
 */
function updateMetaDescription(description) {
    const meta = document.querySelector(
        'meta[name="description"]'
    );

    if (meta) {
        meta.content = description;
    }
}

/**
 * Sets text content of an element.
 *
 * @param {string} selector
 * @param {string} value
 * @returns {void}
 */
function setText(selector, value) {
    const element = document.querySelector(
        selector
    );

    if (element) {
        element.textContent = value;
    }
}

/**
 * Renders product not found state.
 *
 * @returns {void}
 */
function renderProductNotFound() {
    const main = document.querySelector(
        '.product-page'
    );

    if (!main) {
        return;
    }

    main.innerHTML = `
        <div class="container">
            <section class="product-not-found">
                <h1>Товар не найден</h1>

                <p>
                    Возможно, товар был удалён
                    или ссылка устарела.
                </p>

                <a href="catalog.html">
                    Вернуться в каталог
                </a>
            </section>
        </div>
    `;

    document.title =
        'Товар не найден — Краски и Лепнина';
}
