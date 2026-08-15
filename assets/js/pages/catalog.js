import { getCatalogData } from '../data/catalog-data.js';
import { createCatalogProduct } from '../components/CatalogProduct.js';
import { FILTERS } from '../data/catalog-filters.js';

const PRODUCTS_PER_PAGE = 6;

const DEFAULT_STATE = {
    category: '',
    materialType: [],
    application: [],
    effect: [],
    base: [],
    priceMin: '',
    priceMax: '',
    sort: 'default',
    view: 'grid',
};

let state = createDefaultState();

let catalogData = {
    products: [],
    categories: [],
    filters: {},
};

function createDefaultState() {
    return {
        ...DEFAULT_STATE,
        materialType: [],
        application: [],
        effect: [],
        base: [],
    };
}

export async function initCatalog() {
    const container = document.querySelector('.catalog-products');

    if (!container) {
        return;
    }

	catalogData = await getCatalogData();

   const filterBody = document.querySelector(
      '.catalog-filter__body'
   );

	const filterToggle = document.querySelector(
		'.catalog-filter__toggle'
	);

    const sortSelect = document.querySelector(
        '.catalog-toolbar__sort select'
    );

    const viewButtons = document.querySelectorAll(
        '.catalog-toolbar__view'
    );

   state = readStateFromUrl();

	renderCategories();

	const categoryLinks = document.querySelectorAll(
		'.catalog__category'
	);

	renderFilters(filterBody);
	syncFilterControls();
	syncFilterToggle();
	renderCatalog();

    categoryLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const url = new URL(
                link.href,
                window.location.href
            );

            state.category = url.searchParams.get('category') ?? '';

            updateUrl({
                resetPage: true,
            });

            syncFilterControls();
            renderCatalog();
        });
    });

   filterBody?.addEventListener(
      'change',
      handleFilterChange
   );

	filterToggle?.addEventListener(
		'click',
		toggleFilters
	);

    sortSelect?.addEventListener('change', () => {
        state.sort = sortSelect.value;

        updateUrl({
            resetPage: true,
        });

        renderCatalog();
    });

    viewButtons.forEach((button) => {
		button.addEventListener('click', () => {
			if (
					window.matchMedia(
						'(max-width: 767px)'
					).matches
			) {
					return;
			}

			state.view =
					button.getAttribute('aria-label') === 'Список'
						? 'list'
						: 'grid';

			updateUrl();
			syncView();
		});
	});

    window.addEventListener('popstate', () => {
        state = readStateFromUrl();

        syncFilterControls();
        renderCatalog();
    });

	 window.addEventListener('resize', () => {
		syncView();
		syncFilterToggle();
	});

	const mediaQuery = window.matchMedia(
		'(max-width: 767px)'
	);

	mediaQuery.addEventListener('change', () => {
		syncView();
		syncFilterToggle();
	});
}


/* =========================================================
   CATALOG
   ========================================================= */

function renderCatalog() {
    const container = document.querySelector(
        '.catalog-products'
    );

    if (!container) {
        return;
    }

    const filteredProducts = getFilteredProducts();
    const sortedProducts = sortProducts(filteredProducts);

    const totalPages = getTotalPages(sortedProducts);

    let currentPage = getCurrentPage();

    if (totalPages === 0) {
        currentPage = 1;

        updatePageUrl(1, true);

        renderEmptyState(container);
    } else {
        if (currentPage > totalPages) {
            currentPage = totalPages;

            updatePageUrl(currentPage, true);
        }

        const products = getProductsForPage(
            sortedProducts,
            currentPage
        );

        container.replaceChildren(
				...products.map((product) =>
					createCatalogProduct({
							...product,
							categoryName: getCategoryName(
								product.category
							),
					})
				)
			);
    }

    renderPagination(
        totalPages,
        currentPage
    );

    updateCount(sortedProducts.length);
    updateCategories();
    syncView();
}


/* =========================================================
   FILTERING
   ========================================================= */

function getFilteredProducts() {
    return catalogData.products.filter((product) => {
        if (
            state.category &&
            product.category !== state.category
        ) {
            return false;
        }

        if (
            state.materialType.length &&
            !state.materialType.includes(
                product.materialType
            )
        ) {
            return false;
        }

        if (
            state.application.length &&
            !state.application.some((value) =>
                product.applications?.includes(value)
            )
        ) {
            return false;
        }

        if (
            state.effect.length &&
            !state.effect.some((value) =>
                product.effects?.includes(value)
            )
        ) {
            return false;
        }

        if (
            state.base.length &&
            !state.base.includes(product.base)
        ) {
            return false;
        }

        if (
            state.priceMin !== '' &&
            product.price < Number(state.priceMin)
        ) {
            return false;
        }

        if (
            state.priceMax !== '' &&
            product.price > Number(state.priceMax)
        ) {
            return false;
        }

        return true;
    });
}


/* =========================================================
   SORTING
   ========================================================= */

function sortProducts(products) {
    const result = [...products];

    switch (state.sort) {
        case 'price-asc':
            return result.sort(
                (a, b) => a.price - b.price
            );

        case 'price-desc':
            return result.sort(
                (a, b) => b.price - a.price
            );

        case 'name':
            return result.sort((a, b) =>
                a.title.localeCompare(
                    b.title,
                    'ru'
                )
            );

        default:
            return result;
    }
}


/* =========================================================
   PAGINATION
   ========================================================= */

function getCurrentPage() {
    const page = Number(
        new URLSearchParams(
            window.location.search
        ).get('page')
    );

    return Number.isInteger(page) && page > 0
        ? page
        : 1;
}

function getTotalPages(products) {
    return Math.ceil(
        products.length / PRODUCTS_PER_PAGE
    );
}

function getProductsForPage(products, page) {
    const start =
        (page - 1) * PRODUCTS_PER_PAGE;

    return products.slice(
        start,
        start + PRODUCTS_PER_PAGE
    );
}

function renderPagination(totalPages, currentPage) {
    const pagination = document.querySelector(
        '.catalog-pagination'
    );

    if (!pagination) {
        return;
    }

    pagination.replaceChildren();

    if (totalPages <= 1) {
        pagination.hidden = true;
        return;
    }

    pagination.hidden = false;

    pagination.appendChild(
        createPaginationButton(
            '←',
            currentPage - 1,
            currentPage === 1,
            'Предыдущая страница'
        )
    );

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {
        pagination.appendChild(
            createPaginationButton(
                String(page),
                page,
                false,
                `Страница ${page}`,
                page === currentPage
            )
        );
    }

    pagination.appendChild(
        createPaginationButton(
            '→',
            currentPage + 1,
            currentPage === totalPages,
            'Следующая страница'
        )
    );
}

function createPaginationButton(
    text,
    page,
    disabled = false,
    ariaLabel = '',
    active = false
) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className =
        'catalog-pagination__button';

    button.textContent = text;

    if (ariaLabel) {
        button.setAttribute(
            'aria-label',
            ariaLabel
        );
    }

    if (active) {
        button.classList.add('is-active');
        button.setAttribute(
            'aria-current',
            'page'
        );
    }

    button.disabled = disabled;

    if (!disabled) {
        button.addEventListener('click', () => {
            updatePageUrl(page);
            renderCatalog();
        });
    }

    return button;
}


/* =========================================================
   FILTER UI
   ========================================================= */

function renderFilters(container) {
    if (!container) {
        return;
    }

    container.replaceChildren();

    Object.entries(catalogData.filters).forEach(
        ([key, filter]) => {
            const group =
                document.createElement('fieldset');

            group.className =
                'catalog-filter__group';

            const legend =
                document.createElement('legend');

            legend.className =
                'catalog-filter__title';

            legend.textContent = filter.title;

            group.appendChild(legend);

            Object.entries(filter.options).forEach(
                ([value, label]) => {
                    const wrapper =
                        document.createElement('label');

                    wrapper.className =
                        'catalog-filter__option';

                    wrapper.innerHTML = `
                        <input
                            type="checkbox"
                            name="${key}"
                            value="${value}"
                        >
                        <span>${label}</span>
                    `;

                    group.appendChild(wrapper);
                }
            );

            container.appendChild(group);
        }
    );

    const priceGroup =
        document.createElement('fieldset');

    priceGroup.className =
        'catalog-filter__group';

    priceGroup.innerHTML = `
        <legend class="catalog-filter__title">
            Цена
        </legend>

        <div class="catalog-filter__price">
            <input
                type="number"
                name="priceMin"
                min="0"
                placeholder="От"
                aria-label="Минимальная цена"
            >

            <input
                type="number"
                name="priceMax"
                min="0"
                placeholder="До"
                aria-label="Максимальная цена"
            >
        </div>
    `;

    container.appendChild(priceGroup);

    const resetButton =
        document.createElement('button');

    resetButton.type = 'button';
    resetButton.className =
        'catalog-filter__reset';

    resetButton.textContent =
        'Сбросить фильтры';

    resetButton.addEventListener(
        'click',
        resetFilters
    );

    container.appendChild(resetButton);
}

function toggleFilters() {
    const toggle = document.querySelector(
        '.catalog-filter__toggle'
    );

    const body = document.querySelector(
        '.catalog-filter__body'
    );

    if (!toggle || !body) {
        return;
    }

    const isExpanded =
        toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute(
        'aria-expanded',
        String(!isExpanded)
    );

    body.hidden = isExpanded;
}

function handleFilterChange(event) {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
        return;
    }

    if (target.type === 'checkbox') {
        const key = target.name;

        state[key] = [
            ...document.querySelectorAll(
                `input[name="${key}"]:checked`
            ),
        ].map((input) => input.value);
    }

    if (target.type === 'number') {
        state[target.name] = target.value;
    }

    updateUrl({
        resetPage: true,
    });

    renderCatalog();
}

function resetFilters() {
    state = createDefaultState();

    updateUrl({
        resetPage: true,
    });

    syncFilterControls();
	    syncFilterToggle();
    renderCatalog();
}


/* =========================================================
   UI SYNC
   ========================================================= */

function syncFilterControls() {
    Object.keys(catalogData.filters).forEach((key) => {
        const selectedValues = state[key];

        document
            .querySelectorAll(`input[name="${key}"]`)
            .forEach((input) => {
                input.checked =
                    selectedValues.includes(
                        input.value
                    );
            });
    });

    const priceMin = document.querySelector(
        'input[name="priceMin"]'
    );

    const priceMax = document.querySelector(
        'input[name="priceMax"]'
    );

    if (priceMin) {
        priceMin.value = state.priceMin;
    }

    if (priceMax) {
        priceMax.value = state.priceMax;
    }

    const sortSelect = document.querySelector(
        '.catalog-toolbar__sort select'
    );

    if (sortSelect) {
        sortSelect.value = state.sort;
    }
}

function syncView() {
    const container = document.querySelector(
        '.catalog-products'
    );

    if (!container) {
        return;
    }

    const isMobile = window.matchMedia(
        '(max-width: 767px)'
    ).matches;

    const isList =
        !isMobile && state.view === 'list';

    container.classList.toggle(
        'is-list',
        isList
    );

    document
        .querySelectorAll(
            '.catalog-toolbar__view'
        )
        .forEach((button) => {
            const buttonIsList =
                button.getAttribute(
                    'aria-label'
                ) === 'Список';

            button.setAttribute(
                'aria-pressed',
                String(
                    buttonIsList
                        ? isList
                        : !isList
                )
            );
        });
}

function updateCount(count) {
    const element = document.querySelector(
        '.catalog-toolbar__count'
    );

    if (!element) {
        return;
    }

    element.textContent =
        `Найдено: ${count}`;
}

function updateCategories() {
    document
        .querySelectorAll('.catalog__category')
        .forEach((link) => {
            const url = new URL(
                link.href,
                window.location.href
            );

            const category =
                url.searchParams.get('category') ?? '';

            const isActive =
                category === state.category;

            link.classList.toggle(
                'is-active',
                isActive
            );

            if (isActive) {
                link.setAttribute(
                    'aria-current',
                    'page'
                );
            } else {
                link.removeAttribute(
                    'aria-current'
                );
            }
        });
}

function syncFilterToggle() {
    const toggle = document.querySelector(
        '.catalog-filter__toggle'
    );

    const body = document.querySelector(
        '.catalog-filter__body'
    );

    if (!toggle || !body) {
        return;
    }

    const isMobile = window.matchMedia(
        '(max-width: 767px)'
    ).matches;

    const shouldOpen = !isMobile;

    toggle.setAttribute(
        'aria-expanded',
        String(shouldOpen)
    );

    body.hidden = !shouldOpen;
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function renderEmptyState(container) {
    const empty =
        document.createElement('div');

    empty.className =
        'catalog-products__empty';

    empty.innerHTML = `
        <h2 class="catalog-products__empty-title">
            Ничего не найдено
        </h2>

        <p class="catalog-products__empty-text">
            Попробуйте изменить параметры фильтрации.
        </p>
    `;

    container.replaceChildren(empty);
}


/* =========================================================
   URL
   ========================================================= */

function updateUrl({
    resetPage = false,
    replace = false,
} = {}) {
    const url = new URL(
        window.location.href
    );

    const params = url.searchParams;

    params.delete('category');
    params.delete('materialType');
    params.delete('application');
    params.delete('effect');
    params.delete('base');
    params.delete('priceMin');
    params.delete('priceMax');
    params.delete('sort');
    params.delete('view');

    if (resetPage) {
        params.delete('page');
    }

    if (state.category) {
        params.set(
            'category',
            state.category
        );
    }

   Object.keys(catalogData.filters).forEach((key) => {
		if (state[key].length) {
			params.set(
					key,
					state[key].join(',')
			);
		}
	});

    if (state.priceMin !== '') {
        params.set(
            'priceMin',
            state.priceMin
        );
    }

    if (state.priceMax !== '') {
        params.set(
            'priceMax',
            state.priceMax
        );
    }

    if (state.sort !== DEFAULT_STATE.sort) {
        params.set(
            'sort',
            state.sort
        );
    }

    if (state.view !== DEFAULT_STATE.view) {
        params.set(
            'view',
            state.view
        );
    }

    const query = params.toString();

    const nextUrl = query
        ? `${url.pathname}?${query}`
        : url.pathname;

    const method = replace
        ? 'replaceState'
        : 'pushState';

    window.history[method](
        state,
        '',
        nextUrl
    );
}

function updatePageUrl(
    page,
    replace = false
) {
    const url = new URL(
        window.location.href
    );

    if (page <= 1) {
        url.searchParams.delete('page');
    } else {
        url.searchParams.set(
            'page',
            page
        );
    }

    const method = replace
        ? 'replaceState'
        : 'pushState';

    window.history[method](
        state,
        '',
        url
    );
}

function readStateFromUrl() {
    const params = new URLSearchParams(
        window.location.search
    );

    return {
        category:
            params.get('category') ?? '',

        materialType: readArrayParam(
            params,
            'materialType'
        ),

        application: readArrayParam(
            params,
            'application'
        ),

        effect: readArrayParam(
            params,
            'effect'
        ),

        base: readArrayParam(
            params,
            'base'
        ),

        priceMin:
            params.get('priceMin') ?? '',

        priceMax:
            params.get('priceMax') ?? '',

        sort:
            params.get('sort') ?? 'default',

        view:
            params.get('view') === 'list'
                ? 'list'
                : 'grid',
    };
}

function readArrayParam(params, key) {
    const value = params.get(key);

    return value
        ? value.split(',').filter(Boolean)
        : [];
}

// Генерация категорий
function renderCategories() {
    const container = document.querySelector(
        '.catalog__categories'
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    const allLink = document.createElement('a');

    allLink.className = 'catalog__category';
    allLink.href = 'catalog.html';
    allLink.textContent = 'Все товары';

    container.appendChild(allLink);

    catalogData.categories.forEach((category) => {
        const link = document.createElement('a');

        link.className = 'catalog__category';
        link.href = `catalog.html?category=${encodeURIComponent(category.id)}`;
        link.textContent = category.name;

        container.appendChild(link);
    });
}

function getCategoryName(categoryId) {
    return catalogData.categories.find(
        (category) => category.id === categoryId
    )?.name ?? categoryId;
}