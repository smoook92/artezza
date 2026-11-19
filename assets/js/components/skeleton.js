const DEFAULT_OPTIONS = {
    type: 'text',
    count: 1,
};

const MAX_COUNT = 20;
const imageRequests = new WeakMap();

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

    const requestId = Symbol('image-request');
    imageRequests.set(image, requestId);

    show(container, { type: 'image' });

    image.alt = alt;
    image.hidden = true;
    container.append(image);

    const load = (url) => new Promise((resolve) => {
        const cleanup = () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        };

        const finish = (loaded) => {
            cleanup();
            resolve(loaded);
        };

        const handleLoad = () => finish(
            imageRequests.get(image) === requestId
        );

        const handleError = () => finish(false);

        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);
        image.src = url;

        if (image.complete) {
            finish(image.naturalWidth > 0);
        }
    });

    let loaded = await load(src);

    if (imageRequests.get(image) !== requestId) {
        return false;
    }

    if (!loaded && fallback && src !== fallback) {
        loaded = await load(fallback);
    }

    if (imageRequests.get(image) !== requestId) {
        return false;
    }

    image.hidden = !loaded;
    hide(container);

    if (!loaded) {
        const placeholder = document.createElement('div');
        placeholder.className = 'skeleton-image-error';
        placeholder.setAttribute('role', 'img');
        placeholder.setAttribute('aria-label', 'Изображение недоступно');
        placeholder.textContent = 'Изображение недоступно';
        container.append(placeholder);
    }

    return loaded;
}

export const Skeleton = Object.freeze({
    show,
    hide,
    loadImage,
});
