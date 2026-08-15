import { getCatalogData } from '../data/catalog-data.js';
import { createCatalogProduct } from '../components/CatalogProduct.js';


document.addEventListener(
    'DOMContentLoaded',
    initSearch
);


/**
 * Инициализирует поиск.
 *
 * @returns {Promise<void>}
 */
async function initSearch() {
    const form = document.querySelector(
        '[data-search-form]'
    );

    const input = document.querySelector(
        '#search-input'
    );

    const container = document.querySelector(
        '[data-search-results]'
    );

    if (!form || !input || !container) {
        return;
    }

    try {
        const catalogData =
            await getCatalogData();

        const query = getSearchQuery();

        input.value = query;

        form.addEventListener(
            'submit',
            (event) => {
                event.preventDefault();

                performSearch(
                    input.value,
                    catalogData
                );
            }
        );

        if (query) {
            performSearch(
                query,
                catalogData
            );

            return;
        }

        renderInitialState(container);

    } catch (error) {
        console.error(
            'Ошибка загрузки поиска:',
            error
        );

        renderError(container);
    }
}


/**
 * Получает поисковый запрос из URL.
 *
 * @returns {string}
 */
function getSearchQuery() {
    return new URLSearchParams(
        window.location.search
    ).get('q')?.trim() ?? '';
}


/**
 * Выполняет поиск.
 *
 * @param {string} value
 * @param {Object} catalogData
 * @returns {void}
 */
function performSearch(
    value,
    catalogData
) {
    const query = value.trim();

    updateUrl(query);

    const products =
        filterProducts(
            catalogData.products,
            catalogData.categories,
            catalogData.effects,
            query
        );

    renderResults(
        products,
        query,
        catalogData.categories
    );
}


/**
 * Фильтрует товары.
 *
 * @param {Array} products
 * @param {Array} categories
 * @param {Array} effects
 * @param {string} query
 * @returns {Array}
 */
function filterProducts(
    products,
    categories,
    effects,
    query
) {
    if (!query) {
        return products;
    }

    const normalizedQuery =
        normalize(query);

    return products.filter(
        (product) => {
            const category =
                categories.find(
                    (item) =>
                        item.id === product.category
                );

            const categoryName =
                category?.name ?? '';

            const productEffects =
                (product.effects ?? [])
                    .map((effectId) => {
                        return effects.find(
                            (effect) =>
                                effect.id === effectId
                        )?.name ?? '';
                    })
                    .join(' ');

            const searchableText = [
                product.title,
                product.description,
                product.shortDescription,
                product.alt,
                product.category,
                categoryName,
                product.materialType,
                product.base,
                productEffects,
            ]
                .filter(Boolean)
                .join(' ');

            return normalize(
                searchableText
            ).includes(normalizedQuery);
        }
    );
}


/**
 * Рендерит результаты.
 *
 * @param {Array} products
 * @param {string} query
 * @param {Array} categories
 * @returns {void}
 */
function renderResults(
    products,
    query,
    categories
) {
    const container =
        document.querySelector(
            '[data-search-results]'
        );

    const count =
        document.querySelector(
            '[data-search-count]'
        );

    if (!container) {
        return;
    }

    container.replaceChildren();

    if (!query) {
        if (count) {
            count.textContent = '';
        }

        renderInitialState(container);

        return;
    }

    if (count) {
        count.textContent =
            formatCount(
                products.length
            );
    }

    if (!products.length) {
        renderEmptyState(
            container,
            query
        );

        return;
    }

    container.append(
        ...products.map(
            (product) =>
                createCatalogProduct({
                    ...product,
                    categoryName:
                        getCategoryName(
                            product.category,
                            categories
                        ),
                })
        )
    );
}


/**
 * Создаёт пустое состояние.
 *
 * @param {HTMLElement} container
 * @param {string} query
 * @returns {void}
 */
function renderEmptyState(
    container,
    query
) {
    const element =
        document.createElement('div');

    element.className =
        'search-results__empty';

    element.innerHTML = `
        <h3 class="search-results__empty-title">
            Ничего не найдено
        </h3>

        <p class="search-results__empty-text">
            По запросу
            «${escapeHtml(query)}»
            подходящих товаров не найдено.
            Попробуйте изменить запрос.
        </p>
    `;

    container.appendChild(element);
}


/**
 * Создаёт начальное состояние.
 *
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderInitialState(container) {
    const element =
        document.createElement('div');

    element.className =
        'search-results__initial';

    element.textContent =
        'Введите запрос, чтобы найти подходящие материалы.';

    container.replaceChildren(element);
}


/**
 * Создаёт состояние ошибки.
 *
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderError(container) {
    container.innerHTML = `
        <div class="search-results__empty">

            <h3 class="search-results__empty-title">
                Поиск недоступен
            </h3>

            <p class="search-results__empty-text">
                Не удалось загрузить каталог.
                Попробуйте обновить страницу.
            </p>

        </div>
    `;
}


/**
 * Получает название категории.
 *
 * @param {string} categoryId
 * @param {Array} categories
 * @returns {string}
 */
function getCategoryName(
    categoryId,
    categories
) {
    return categories.find(
        (category) =>
            category.id === categoryId
    )?.name ?? categoryId;
}


/**
 * Обновляет URL.
 *
 * @param {string} query
 * @returns {void}
 */
function updateUrl(query) {
    const url =
        new URL(window.location.href);

    if (query) {
        url.searchParams.set(
            'q',
            query
        );
    } else {
        url.searchParams.delete('q');
    }

    window.history.replaceState(
        {},
        '',
        url
    );
}


/**
 * Нормализует строку.
 *
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
    return String(value)
        .toLocaleLowerCase('ru-RU')
        .trim();
}


/**
 * Форматирует количество результатов.
 *
 * @param {number} count
 * @returns {string}
 */
function formatCount(count) {
    if (count === 0) {
        return '0 товаров';
    }

    if (
        count % 10 === 1 &&
        count % 100 !== 11
    ) {
        return `${count} товар`;
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (
            count % 100 < 10 ||
            count % 100 >= 20
        )
    ) {
        return `${count} товара`;
    }

    return `${count} товаров`;
}


/**
 * Экранирует HTML.
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