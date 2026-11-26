import { setCanonicalUrl } from '../core/seo.js';
import { getCatalogData } from '../data/catalog-data.js';
import { Skeleton } from '../components/skeleton.js';

import {
    addToCart,
    getCartQuantity,
} from '../core/cart.js';

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

        setCanonicalUrl('id', product.id);

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

    renderProductBrand(product);
    renderProductTabs(product);
    initProductTabs();

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

    const volumeState = {
        selected: product.volumeOptions?.[0] ?? null,
    };
    
    renderVolumeOptions(product, volumeState);
    renderMainImage(product);
    renderGallery(product);
    renderCharacteristics(product);
    updateBreadcrumb(product);
    initAddToCart(product, volumeState);
}

/**
 * Renders product volume options.
 *
 * @param {Object} product
 * @param {{selected: Object|null}} volumeState
 * @returns {void}
 */
function renderVolumeOptions(product, volumeState) {
    const container = document.querySelector(
        '.product__volume-options'
    );

    const volumeBlock = document.querySelector(
        '.product__volume'
    );

    if (!container || !volumeBlock) {
        volumeState.selected = null;
        return;
    }

    container.replaceChildren();

    if (!product.volumeOptions?.length) {
        volumeBlock.hidden = true;
        return;
    }

    volumeBlock.hidden = false;

    const priceElement = document.querySelector(
        '.product__price'
    );

    if (!priceElement) {
        volumeState.selected = null;
        volumeBlock.hidden = true;
        return;
    }

    product.volumeOptions.forEach((option, index) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'product__volume-option';
        button.textContent = option.label;

        button.setAttribute(
            'aria-pressed',
            String(index === 0)
        );

        if (index === 0) {
            button.classList.add('is-active');
        }

        button.addEventListener('click', () => {
            container
                .querySelectorAll('.product__volume-option')
                .forEach((item) => {
                    const isActive = item === button;
        
                    item.setAttribute(
                        'aria-pressed',
                        String(isActive)
                    );
        
                    item.classList.toggle(
                        'is-active',
                        isActive
                    );
                });
        
            volumeState.selected = option;
        
            const price = product.price * option.multiplier;
        
            priceElement.textContent =
                `${price.toLocaleString('ru-RU')} ₽`;
        });

        container.appendChild(button);
    });

    const initialPrice = product.price *
        product.volumeOptions[0].multiplier;

    priceElement.textContent =
        `${initialPrice.toLocaleString('ru-RU')} ₽`;
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

    Skeleton.loadImage(
        image.closest('.product__main-image'),
        image,
        product.image,
        product.alt ?? product.title,
        'assets/images/catalog/decorative-plaster.jpg'
    );
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

    Skeleton.loadImage(
        mainImage.closest('.product__main-image'),
        mainImage,
        image,
        product.alt ?? product.title,
        'assets/images/catalog/decorative-plaster.jpg'
    );

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
 * Renders the optional product brand.
 *
 * @param {Object} product
 * @returns {void}
 */
function renderProductBrand(product) {
    const container = document.querySelector('.product__brand');
    const logo = document.querySelector('.product__brand-logo');
    const name = document.querySelector('.product__brand-name');

    if (!container || !logo || !name || !product.brand) {
        return;
    }

    name.textContent = product.brand;

    if (product.brandLogo) {
        logo.src = product.brandLogo;
        logo.alt = product.brand;
        logo.hidden = false;
    } else {
        logo.hidden = true;
    }

    container.hidden = false;
}

/**
 * Populates information panels from available product data.
 *
 * @param {Object} product
 * @returns {void}
 */
function renderProductTabs(product) {
    setText('.product-tabs__description', product.description || product.shortDescription || 'Описание товара пока не добавлено.');
}

/**
 * Initializes accessible product information tabs.
 *
 * @returns {void}
 */
function initProductTabs() {
    const tabs = [...document.querySelectorAll('.product-tabs__tab')];

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => activateProductTab(tab, tabs));

        tab.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                return;
            }

            event.preventDefault();

            const currentIndex = tabs.indexOf(tab);
            let nextIndex = currentIndex;

            if (event.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else if (event.key === 'ArrowLeft') {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = tabs.length - 1;
            }

            activateProductTab(tabs[nextIndex], tabs);
            tabs[nextIndex].focus();
        });
    });
}

/**
 * Activates a product information tab and its panel.
 *
 * @param {HTMLButtonElement} activeTab
 * @param {HTMLButtonElement[]} tabs
 * @returns {void}
 */
function activateProductTab(activeTab, tabs) {
    tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        const panel = document.getElementById(
            tab.getAttribute('aria-controls')
        );

        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;

        if (panel) {
            panel.hidden = !isActive;
            panel.classList.toggle('is-active', isActive);
        }
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
        '.product-tabs__characteristics'
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
 * @param {{selected: Object|null}} volumeState
 * @returns {void}
 */
function initAddToCart(product, volumeState) {
    const button = document.querySelector(
        '.product__add-to-cart'
    );

    if (!button) {
        return;
    }

    button.addEventListener('click', () => {
        const selectedVolume = volumeState.selected;

        const variant = selectedVolume
            ? {
                volume: selectedVolume.value,
                unitPrice:
                    product.price * selectedVolume.multiplier,
            }
            : null;

        const isAdded = addToCart(
            product.id,
            1,
            variant
        );
        
        if (isAdded) {
            button.textContent = 'Добавлено в корзину';
            button.classList.add('is-added');
        
            updateCartBadge();
        } else {
            button.textContent = 'Не удалось добавить';
        }

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
