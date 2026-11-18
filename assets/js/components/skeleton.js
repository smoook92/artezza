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

/**
 * Loads an image while displaying a skeleton placeholder.
 *
 * @param {HTMLElement} container
 * @param {HTMLImageElement} image
 * @param {string} src
 * @param {string} alt
 * @param {string|null} fallback
 * @returns {Promise<boolean>}
 */
async function loadImage(container, image, src, alt = '', fallback = null) {
    if (!(container instanceof HTMLElement) || !(image instanceof HTMLImageElement)) {
        throw new TypeError('Skeleton.loadImage(): invalid container or image.');
    }

    show(container, { type: 'image' });

    image.alt = alt;
    image.hidden = true;
    container.append(image);

    const load = (url) => new Promise((resolve) => {
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = url;

        if (image.complete) {
            resolve(image.naturalWidth > 0);
        }
    });

    let loaded = await load(src);

    if (!loaded && fallback && src !== fallback) {
        loaded = await load(fallback);
    }

    image.onload = null;
    image.onerror = null;
    image.hidden = !loaded;

    hide(container);

    return loaded;
}

export const Skeleton = Object.freeze({
    show,
    hide,
    loadImage,
});
