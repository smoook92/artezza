import { catalogProducts } from '../data/catalog-products.js';
import { createCatalogProduct } from '../components/CatalogProduct.js';

document.addEventListener(
    'DOMContentLoaded',
    initInstruments
);

/**
 * Инициализирует страницу инструментов.
 *
 * @returns {void}
 */
function initInstruments() {
    const container = document.querySelector(
        '.instruments-products'
    );

    if (!container) {
        return;
    }

    const products = getInstrumentProducts();

    renderProducts(container, products);
    updateCount(products.length);
}

/**
 * Возвращает товары категории "Инструменты".
 *
 * Используется единый источник catalog-products.js.
 *
 * @returns {Array}
 */
function getInstrumentProducts() {
    return catalogProducts.filter(
        (product) => product.category === 'tools'
    );
}

/**
 * Отображает карточки инструментов.
 *
 * @param {HTMLElement} container
 * @param {Array} products
 *
 * @returns {void}
 */
function renderProducts(container, products) {
    container.replaceChildren();

    if (!products.length) {
        renderEmptyState(container);
        return;
    }

    container.append(
        ...products.map((product) =>
            createCatalogProduct({
                ...product,
                categoryName: 'Инструменты',
            })
        )
    );
}

/**
 * Отображает состояние пустого списка.
 *
 * @param {HTMLElement} container
 *
 * @returns {void}
 */
function renderEmptyState(container) {
    const empty = document.createElement('div');

    empty.className =
        'instruments-products__empty';

    empty.innerHTML = `
        <h2 class="instruments-products__empty-title">
            Инструменты не найдены
        </h2>

        <p class="instruments-products__empty-text">
            Сейчас в каталоге нет доступных инструментов.
        </p>

        <a
            class="instruments-products__empty-link"
            href="catalog.html"
        >
            Перейти в каталог
        </a>
    `;

    container.appendChild(empty);
}

/**
 * Обновляет количество найденных товаров.
 *
 * @param {number} count
 *
 * @returns {void}
 */
function updateCount(count) {
    const element = document.querySelector(
        '.instruments-catalog__count'
    );

    if (!element) {
        return;
    }

    element.textContent =
        `Найдено: ${count}`;
}