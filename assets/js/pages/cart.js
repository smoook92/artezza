import {
    getCart,
    saveCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} from '../core/cart.js';

import { catalogProducts } from '../data/catalog-products.js';
import { catalogCategories } from '../data/catalog-categories.js';


document.addEventListener(
    'DOMContentLoaded',
    initCart
);


function initCart() {
    const page = document.querySelector(
        '.cart-page'
    );

    if (!page) {
        return;
    }

    bindEvents();
    renderCart();
    updateCartBadge();

    window.addEventListener(
        'cart:updated',
        () => {
            renderCart();
            updateCartBadge();
        }
    );
}


/**
 * Подключает обработчики страницы.
 *
 * @returns {void}
 */
function bindEvents() {
    document.addEventListener(
        'click',
        handleClick
    );

    const form = document.querySelector(
        '[data-cart-order-form]'
    );

    form?.addEventListener(
        'submit',
        handleOrderSubmit
    );
}


/**
 * Обрабатывает действия корзины.
 *
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleClick(event) {
    const quantityButton =
        event.target.closest(
            '[data-cart-quantity]'
        );

    if (quantityButton) {
        handleQuantityChange(
            quantityButton
        );

        return;
    }

    const removeButton =
        event.target.closest(
            '[data-cart-remove]'
        );

    if (removeButton) {
        removeFromCart(
            removeButton.dataset.cartRemove
        );

        return;
    }

    const clearButton =
        event.target.closest(
            '[data-cart-clear]'
        );

    if (clearButton) {
        clearCart();
    }
}


/**
 * Изменяет количество товара.
 *
 * @param {HTMLElement} button
 * @returns {void}
 */
function handleQuantityChange(button) {
    const productId =
        button.dataset.cartProduct;

    const action =
        button.dataset.cartQuantity;

    const item = getCart().find(
        (cartItem) =>
            cartItem.id === productId
    );

    if (!item) {
        return;
    }

    const quantity =
        action === 'increase'
            ? item.quantity + 1
            : item.quantity - 1;

    updateCartQuantity(
        productId,
        quantity
    );
}


/**
 * Рендерит корзину.
 *
 * @returns {void}
 */
function renderCart() {
    const cart = getCart();

    const validCart = cart.filter(
        (item) => getProduct(item.id)
    );

    if (validCart.length !== cart.length) {
        saveCart(validCart);
        return;
    }

    const content = document.querySelector(
        '[data-cart-content]'
    );

    const empty = document.querySelector(
        '[data-cart-empty]'
    );

    if (!content || !empty) {
        return;
    }

    if (!validCart.length) {
        content.hidden = true;
        empty.hidden = false;
        return;
    }

    content.hidden = false;
    empty.hidden = true;

    renderItems(validCart);
    renderSummary(validCart);
}


/**
 * Рендерит позиции корзины.
 *
 * @param {Array} cart
 * @returns {void}
 */
function renderItems(cart) {
    const container = document.querySelector(
        '[data-cart-items]'
    );

    if (!container) {
        return;
    }

    container.replaceChildren(
        ...cart.map(createCartItem)
    );
}


/**
 * Создаёт HTML позиции корзины.
 *
 * @param {{id: string, quantity: number}} item
 * @returns {HTMLElement}
 */
function createCartItem(item) {
    const product = getProduct(item.id);

    const article =
        document.createElement('article');

    article.className = 'cart-item';

    const categoryName =
        getCategoryName(product.category);

    const itemTotal =
        product.price * item.quantity;

    article.innerHTML = `
        <a
            class="cart-item__media"
            href="${escapeHtml(product.url)}"
            aria-label="${escapeHtml(product.title)}"
        >
            <img
                src="${escapeHtml(product.image)}"
                alt="${escapeHtml(product.alt ?? product.title)}"
                width="600"
                height="600"
                loading="lazy"
            >
        </a>

        <div class="cart-item__content">

            ${
                categoryName
                    ? `
                        <span class="cart-item__category">
                            ${escapeHtml(categoryName)}
                        </span>
                    `
                    : ''
            }

            <h3 class="cart-item__title">
                <a href="${escapeHtml(product.url)}">
                    ${escapeHtml(product.title)}
                </a>
            </h3>

            <p class="cart-item__description">
                ${escapeHtml(product.shortDescription ?? product.description)}
            </p>

            <div class="cart-item__price">
                ${formatPrice(itemTotal)}
            </div>

        </div>

        <div class="cart-item__controls">

            <div
                class="cart-item__quantity"
                aria-label="Количество"
            >

                <button
                    class="cart-item__quantity-button"
                    type="button"
                    data-cart-quantity="decrease"
                    data-cart-product="${escapeHtml(item.id)}"
                    aria-label="Уменьшить количество"
                >
                    −
                </button>

                <span class="cart-item__quantity-value">
                    ${item.quantity}
                </span>

                <button
                    class="cart-item__quantity-button"
                    type="button"
                    data-cart-quantity="increase"
                    data-cart-product="${escapeHtml(item.id)}"
                    aria-label="Увеличить количество"
                >
                    +
                </button>

            </div>

            <button
                class="cart-item__remove"
                type="button"
                data-cart-remove="${escapeHtml(item.id)}"
            >
                Удалить
            </button>

        </div>
    `;

    return article;
}


/**
 * Рендерит итоговые значения.
 *
 * @param {Array} cart
 * @returns {void}
 */
function renderSummary(cart) {
    let total = 0;
    let quantity = 0;

    cart.forEach((item) => {
        const product = getProduct(item.id);

        if (!product) {
            return;
        }

        quantity += item.quantity;
        total += product.price * item.quantity;
    });

    setText(
        '[data-cart-products-total]',
        formatPrice(total)
    );

    setText(
        '[data-cart-total-quantity]',
        String(quantity)
    );

    setText(
        '[data-cart-total]',
        formatPrice(total)
    );
}


/**
 * Обновляет badge корзины.
 *
 * @returns {void}
 */
function updateCartBadge() {
    const quantity = getCart().reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    document
        .querySelectorAll('[data-cart-count]')
        .forEach((badge) => {
            badge.textContent =
                String(quantity);
        });
}


/**
 * Обрабатывает оформление заказа.
 *
 * @param {SubmitEvent} event
 * @returns {void}
 */
function handleOrderSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
        return;
    }

    const cart = getCart();

    if (!cart.length) {
        return;
    }

    const data = new FormData(form);

    const order = {
        id: createOrderId(),
        createdAt: new Date().toISOString(),

        customer: {
            name: data.get('name')?.trim() ?? '',
            phone: data.get('phone')?.trim() ?? '',
            email: data.get('email')?.trim() ?? '',
            comment: data.get('comment')?.trim() ?? '',
        },

        items: cart.map((item) => {
            const product =
                getProduct(item.id);

            return {
                id: item.id,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
            };
        }),

        total: calculateTotal(cart),
    };

    localStorage.setItem(
        'artezza_last_order',
        JSON.stringify(order)
    );

    clearCart();

    window.location.href =
        'order-success.html';
}


/**
 * Возвращает товар по ID.
 *
 * @param {string} productId
 * @returns {Object|null}
 */
function getProduct(productId) {
    return catalogProducts.find(
        (product) =>
            product.id === productId
    ) ?? null;
}


/**
 * Возвращает название категории.
 *
 * @param {string} categoryId
 * @returns {string}
 */
function getCategoryName(categoryId) {
    return catalogCategories.find(
        (category) =>
            category.id === categoryId
    )?.name ?? categoryId;
}


/**
 * Считает итоговую стоимость.
 *
 * @param {Array} cart
 * @returns {number}
 */
function calculateTotal(cart) {
    return cart.reduce(
        (total, item) => {
            const product =
                getProduct(item.id);

            if (!product) {
                return total;
            }

            return total +
                product.price * item.quantity;
        },
        0
    );
}


/**
 * Форматирует цену.
 *
 * @param {number} value
 * @returns {string}
 */
function formatPrice(value) {
    return new Intl.NumberFormat(
        'ru-RU',
        {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
        }
    ).format(value);
}


/**
 * Генерирует ID заказа.
 *
 * @returns {string}
 */
function createOrderId() {
    return `ART-${Date.now()
        .toString(36)
        .toUpperCase()}`;
}


/**
 * Безопасно устанавливает текст.
 *
 * @param {string} selector
 * @param {string} value
 * @returns {void}
 */
function setText(selector, value) {
    const element =
        document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}


/**
 * Экранирует значение HTML.
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