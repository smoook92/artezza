const DEFAULT_OPTIONS = {
    type: 'text',
    count: 1,
};

const MAX_COUNT = 20;

const TEMPLATES = {
    'product-card': createProductCard,
    'portfolio-card': createPortfolioCard,
    'review-card': createReviewCard,
    image: createImage,
    text: createText,
};

/**
 * Displays loading placeholders inside a container.
 *
 * Existing container content is replaced. Render the loaded content before
 * calling hide(), or replace the container children and then call hide().
 *
 * @param {HTMLElement} container
 * @param {{ type?: string, count?: number }} options
 * @returns {void}
 */
function show(container, options = {}) {
    if (!(container instanceof HTMLElement)) {
        throw new TypeError('Skeleton.show(): container must be an HTMLElement.');
    }

    const { type, count } = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const createTemplate = TEMPLATES[type];

    if (!createTemplate) {
        throw new RangeError(`Skeleton.show(): unsupported type "${type}".`);
    }

    const itemCount = Number.isInteger(count)
        ? Math.min(Math.max(count, 1), MAX_COUNT)
        : DEFAULT_OPTIONS.count;

    const fragment = document.createDocumentFragment();
    const group = document.createElement('div');

    group.className = 'skeleton-group';
    group.setAttribute('aria-hidden', 'true');

    for (let index = 0; index < itemCount; index += 1) {
        group.append(createTemplate());
    }

    fragment.append(group);

    container.setAttribute('aria-busy', 'true');
    container.replaceChildren(fragment);
}

/**
 * Removes loading placeholders and clears the busy state.
 *
 * @param {HTMLElement} container
 * @returns {void}
 */
function hide(container) {
    if (!(container instanceof HTMLElement)) {
        return;
    }

    container.querySelectorAll(':scope > .skeleton-group')
        .forEach((group) => group.remove());

    container.setAttribute('aria-busy', 'false');
}

function createBlock(className) {
    const element = document.createElement('div');
    element.className = `skeleton ${className}`;

    return element;
}

function createProductCard() {
    const card = document.createElement('article');
    card.className = 'skeleton-card skeleton-card--product';

    const content = document.createElement('div');
    content.className = 'skeleton-card__content';

    content.append(
        createBlock('skeleton--image'),
        createBlock('skeleton--text skeleton--text-short'),
        createBlock('skeleton--title'),
        createBlock('skeleton--text'),
        createBlock('skeleton--price'),
    );

    card.append(content);

    return card;
}

function createPortfolioCard() {
    const card = document.createElement('article');
    card.className = 'skeleton-card skeleton-card--portfolio';

    const content = document.createElement('div');
    content.className = 'skeleton-card__content';

    content.append(
        createBlock('skeleton--image'),
        createBlock('skeleton--title'),
        createBlock('skeleton--text'),
    );

    card.append(content);

    return card;
}

function createReviewCard() {
    const card = document.createElement('article');
    card.className = 'skeleton-card skeleton-card--review';

    const content = document.createElement('div');
    content.className = 'skeleton-card__content';

    content.append(
        createBlock('skeleton--circle'),
        createBlock('skeleton--text skeleton--text-short'),
        createBlock('skeleton--title'),
        createBlock('skeleton--text'),
        createBlock('skeleton--text'),
    );

    card.append(content);

    return card;
}

function createImage() {
    const wrapper = document.createElement('div');
    wrapper.className = 'skeleton-card';

    wrapper.append(createBlock('skeleton--image'));

    return wrapper;
}

function createText() {
    const wrapper = document.createElement('div');
    wrapper.className = 'skeleton-card skeleton-card--text';

    wrapper.append(
        createBlock('skeleton--title'),
        createBlock('skeleton--text'),
        createBlock('skeleton--text'),
        createBlock('skeleton--text skeleton--text-short'),
    );

    return wrapper;
}

export const Skeleton = Object.freeze({
    show,
    hide,
});
