import { getCatalogData } from '../data/catalog-data.js';
import { catalogEffects } from '../data/catalog-effects.js';
import { createCatalogProduct } from '../components/CatalogProduct.js';

document.addEventListener('DOMContentLoaded', () => {
    initEffect();
});

async function initEffect() {
    const page = document.querySelector('.effect-page');

    if (!page) {
        return;
    }

    const effectId = getEffectId();

    if (!effectId) {
        renderEffectNotFound();
        return;
    }

    const effect = catalogEffects.find(
        (item) => item.id === effectId
    );

    if (!effect) {
        renderEffectNotFound();
        return;
    }

    try {
        const catalogData = await getCatalogData();

        renderEffect(
            effect,
            catalogData.products,
            catalogData.categories
        );
    } catch (error) {
        console.error(
            'Failed to load effect data:',
            error
        );

        renderEffectNotFound();
    }
}

function getEffectId() {
    return new URLSearchParams(
        window.location.search
    ).get('id');
}

function renderEffect(
    effect,
    products,
    categories
) {
    document.title = `${effect.name} — Краски и Лепнина`;

    updateMetaDescription(effect.description);

    setText(
        '.effect__title',
        effect.name
    );

    setText(
        '.effect__description',
        effect.description
    );

    renderEffectImage(effect);

    renderProducts(
        effect,
        products,
        categories
    );

    updateBreadcrumb(effect);
}

function renderEffectImage(effect) {
    const image = document.querySelector(
        '.effect__image'
    );

    if (!image) {
        return;
    }

    image.src = effect.image;
    image.alt = effect.name;
}

function renderProducts(
    effect,
    products,
    categories
) {
    const container = document.querySelector(
        '.effect-products'
    );

    if (!container) {
        return;
    }

    const effectProducts = products.filter(
        (product) =>
            Array.isArray(product.effects) &&
            product.effects.includes(effect.id)
    );

    container.replaceChildren();

    if (!effectProducts.length) {
        renderEmptyProducts(
            container,
            effect
        );

        return;
    }

    container.append(
        ...effectProducts.map((product) =>
            createCatalogProduct({
                ...product,
                categoryName: getCategoryName(
                    product.category,
                    categories
                ),
            })
        )
    );
}

function getCategoryName(
    categoryId,
    categories
) {
    return categories.find(
        (category) =>
            category.id === categoryId
    )?.name ?? categoryId;
}

function renderEmptyProducts(
    container,
    effect
) {
    const empty = document.createElement('div');

    empty.className =
        'effect-products__empty';

    empty.innerHTML = `
        <h2 class="effect-products__empty-title">
            Товары не найдены
        </h2>

        <p class="effect-products__empty-text">
            Сейчас нет товаров с эффектом
            «${escapeHtml(effect.name)}».
        </p>

        <a
            class="effect-products__empty-link"
            href="catalog.html"
        >
            Вернуться в каталог
        </a>
    `;

    container.appendChild(empty);
}

function updateBreadcrumb(effect) {
    setText(
        '.effect-breadcrumbs__current',
        effect.name
    );
}

function updateMetaDescription(
    description
) {
    const meta = document.querySelector(
        'meta[name="description"]'
    );

    if (meta) {
        meta.content = description;
    }
}

function setText(selector, value) {
    const element = document.querySelector(
        selector
    );

    if (element) {
        element.textContent = value;
    }
}

function renderEffectNotFound() {
    const page = document.querySelector(
        '.effect-page'
    );

    if (!page) {
        return;
    }

    page.innerHTML = `
        <div class="container">
            <section class="effect-not-found">
                <h1>Эффект не найден</h1>

                <p>
                    Возможно, эффект был удалён
                    или ссылка устарела.
                </p>

                <a href="effects.html">
                    Вернуться к эффектам
                </a>
            </section>
        </div>
    `;

    document.title =
        'Эффект не найден — Краски и Лепнина';
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}