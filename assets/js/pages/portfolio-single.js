import { portfolioData } from '../data/portfolio-data.js';
import { catalogProducts } from '../data/catalog-products.js';

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioSingle();
});

/**
 * Инициализирует страницу отдельной работы.
 *
 * @returns {void}
 */
function initPortfolioSingle() {
    const page = document.querySelector('.portfolio-single-page');

    if (!page) {
        return;
    }

    const projectId = getProjectId();

    if (!projectId) {
        renderNotFound();
        return;
    }

    const project = findProject(projectId);

    if (!project) {
        renderNotFound();
        return;
    }

    const product = findRelatedProduct(project.relatedProductId);

    renderProject(project, product);
    updateMeta(project);
}

/**
 * Получает ID проекта из URL.
 *
 * @returns {string|null}
 */
function getProjectId() {
    const params = new URLSearchParams(window.location.search);

    return params.get('id');
}

/**
 * Находит проект по ID.
 *
 * @param {string} id
 * @returns {Object|null}
 */
function findProject(id) {
    return portfolioData.find((project) => project.id === id) ?? null;
}

/**
 * Находит связанный товар.
 *
 * @param {string} productId
 * @returns {Object|null}
 */
function findRelatedProduct(productId) {
    if (!productId) {
        return null;
    }

    return catalogProducts.find(
        (product) => product.id === productId
    ) ?? null;
}

/**
 * Заполняет страницу данными проекта.
 *
 * @param {Object} project
 * @param {Object|null} product
 * @returns {void}
 */
function renderProject(project, product) {
    setText('.portfolio-single__category', project.category);
    setText('.portfolio-single__title', project.title);
    setText('.portfolio-single__description', project.description);

    const image = document.querySelector(
        '.portfolio-single__image'
    );

    if (image) {
        image.src = project.image;
        image.alt = project.title;
    }

    setText(
        '.portfolio-single__about-description',
        project.description
    );

    setText(
        '.portfolio-single__material',
        project.category
    );

    renderRelatedProduct(product);
}

/**
 * Отображает связанный товар.
 *
 * @param {Object|null} product
 * @returns {void}
 */
function renderRelatedProduct(product) {
    const section = document.querySelector(
        '.portfolio-single__product'
    );

    if (!section) {
        return;
    }

    if (!product) {
        section.hidden = true;
        return;
    }

    const title = section.querySelector(
        '.portfolio-single__product-title'
    );

    const description = section.querySelector(
        '.portfolio-single__product-description'
    );

    const link = section.querySelector(
        '.portfolio-single__product-link'
    );

    if (title) {
        title.textContent = product.title;
    }

    if (description) {
        description.textContent = product.description;
    }

    if (link) {
        link.href = `product.html?id=${encodeURIComponent(product.id)}`;
    }
}

/**
 * Обновляет SEO-метаданные страницы.
 *
 * @param {Object} project
 * @returns {void}
 */
function updateMeta(project) {
    document.title = `${project.title} — ARTEZZA`;

    const meta = document.querySelector(
        'meta[name="description"]'
    );

    if (!meta) {
        return;
    }

    meta.content =
        `${project.title}. ${project.description}`;
}

/**
 * Устанавливает текст элемента.
 *
 * @param {string} selector
 * @param {string} value
 * @returns {void}
 */
function setText(selector, value) {
    const element = document.querySelector(selector);

    if (!element) {
        return;
    }

    element.textContent = value;
}

/**
 * Показывает состояние отсутствующего проекта.
 *
 * @returns {void}
 */
function renderNotFound() {
    const page = document.querySelector('.portfolio-single-page');

    if (!page) {
        return;
    }

    page.innerHTML = `
        <div class="container">
            <h1>Работа не найдена</h1>
            <p>
                Запрашиваемый проект не существует или был удалён.
            </p>
            <a href="portfolio.html">
                ← Все работы
            </a>
        </div>
    `;

    document.title = 'Работа не найдена — ARTEZZA';
}