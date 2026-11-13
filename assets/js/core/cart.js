
const CART_STORAGE_KEY = 'artezza_cart';

/**
 * Returns cart contents.
 *
 * @returns {Array}
 */
export function getCart() {
    try {
        const stored = localStorage.getItem(
            CART_STORAGE_KEY
        );

        if (!stored) {
            return [];
        }

        const cart = JSON.parse(stored);

        return Array.isArray(cart)
            ? cart.filter(isValidCartItem)
            : [];
    } catch (error) {
        console.error(
            'Не удалось загрузить корзину:',
            error
        );

        return [];
    }
}


/**
 * Saves cart contents.
 *
 * @param {Array} cart
 * @returns {void}
 */
export function saveCart(cart) {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

        window.dispatchEvent(
            new CustomEvent('cart:updated', {
                detail: { cart },
            })
        );
    } catch (error) {
        console.error(
            'Не удалось сохранить корзину:',
            error
        );
    }
}

/**
 * Adds a product or its variant to cart.
 *
 * @param {string} productId
 * @param {number} quantity
 * @param {{volume: string, unitPrice: number}|null} variant
 * @returns {void}
 */
export function addToCart(
    productId,
    quantity = 1,
    variant = null
) {
    if (
        typeof productId !== 'string' ||
        !productId.trim() ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        return;
    }

    if (
        variant !== null &&
        (
            typeof variant.volume !== 'string' ||
            !variant.volume.trim() ||
            typeof variant.unitPrice !== 'number' ||
            !Number.isFinite(variant.unitPrice) ||
            variant.unitPrice < 0
        )
    ) {
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(
        (item) =>
            item.id === productId &&
            (item.volume ?? null) === (variant?.volume ?? null)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity,
            ...(variant ?? {}),
        });
    }

    saveCart(cart);
}

/**
 * Updates quantity of a cart item.
 *
 * @param {string} productId
 * @param {number} quantity
 * @param {string|null} volume
 * @returns {void}
 */
export function updateCartQuantity(
    productId,
    quantity,
    volume = null
) {
    const cart = getCart();

    const item = cart.find(
        (cartItem) =>
            cartItem.id === productId &&
            (cartItem.volume ?? null) === volume
    );

    if (!item) {
        return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        removeFromCart(productId, volume);
        return;
    }

    item.quantity = quantity;

    saveCart(cart);
}

/**
 * Removes a product or its variant from cart.
 *
 * @param {string} productId
 * @param {string|null} volume
 * @returns {void}
 */
export function removeFromCart(
    productId,
    volume = null
) {
    const cart = getCart().filter(
        (item) =>
            !(
                item.id === productId &&
                (item.volume ?? null) === volume
            )
    );

    saveCart(cart);
}

/**
 * Clears cart.
 *
 * @returns {void}
 */
export function clearCart() {
    saveCart([]);
}

/**
 * Returns total quantity of products.
 *
 * @returns {number}
 */
export function getCartQuantity() {
    return getCart().reduce(
        (total, item) => total + item.quantity,
        0
    );
}

/**
 * Validates cart item structure.
 *
 * @param {unknown} item
 * @returns {boolean}
 */
function isValidCartItem(item) {
    return (
        item &&
        typeof item.id === 'string' &&
        item.id.length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        (
            item.volume === undefined ||
            (
                typeof item.volume === 'string' &&
                typeof item.unitPrice === 'number' &&
                Number.isFinite(item.unitPrice) &&
                item.unitPrice >= 0
            )
        )
    );
}
