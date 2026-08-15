const CART_STORAGE_KEY = 'artezza_cart';


/**
 * Возвращает содержимое корзины.
 *
 * @returns {Array<{id: string, quantity: number}>}
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

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart.filter(isValidCartItem);
    } catch (error) {
        console.error(
            'Не удалось загрузить корзину:',
            error
        );

        return [];
    }
}


/**
 * Сохраняет корзину.
 *
 * @param {Array<{id: string, quantity: number}>} cart
 * @returns {void}
 */
export function saveCart(cart) {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    window.dispatchEvent(
        new CustomEvent('cart:updated', {
            detail: {
                cart,
            },
        })
    );
}


/**
 * Добавляет товар в корзину.
 *
 * @param {string} productId
 * @param {number} quantity
 * @returns {void}
 */
export function addToCart(
    productId,
    quantity = 1
) {
    if (!productId || quantity <= 0) {
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(
        (item) => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity,
        });
    }

    saveCart(cart);
}


/**
 * Изменяет количество товара.
 *
 * @param {string} productId
 * @param {number} quantity
 * @returns {void}
 */
export function updateCartQuantity(
    productId,
    quantity
) {
    const cart = getCart();

    const item = cart.find(
        (cartItem) => cartItem.id === productId
    );

    if (!item) {
        return;
    }

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = Math.floor(quantity);

    saveCart(cart);
}


/**
 * Удаляет товар из корзины.
 *
 * @param {string} productId
 * @returns {void}
 */
export function removeFromCart(productId) {
    const cart = getCart().filter(
        (item) => item.id !== productId
    );

    saveCart(cart);
}


/**
 * Полностью очищает корзину.
 *
 * @returns {void}
 */
export function clearCart() {
    saveCart([]);
}


/**
 * Возвращает количество товаров.
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
 * Проверяет структуру позиции корзины.
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
        item.quantity > 0
    );
}