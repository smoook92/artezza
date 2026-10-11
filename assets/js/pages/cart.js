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

    if (!form) {
        return;
    }

    form.addEventListener(
        'submit',
        handleOrderSubmit
    );

    initOrderForm(form);
}


/**
 * Инициализирует форму заказа.
 *
 * @param {HTMLFormElement} form
 * @returns {void}
 */
function initOrderForm(form) {
    const nameInput = form.elements.name;
    const phoneInput = form.elements.phone;
    const emailInput = form.elements.email;
    const commentInput = form.elements.comment;

    if (nameInput) {
        nameInput.addEventListener(
            'blur',
            () => validateField(form, 'name')
        );

        nameInput.addEventListener(
            'input',
            () => {
                if (nameInput.getAttribute('aria-invalid') === 'true') {
                    validateField(form, 'name');
                }
            }
        );
    }

    if (phoneInput) {
        phoneInput.addEventListener(
            'input',
            handlePhoneInput
        );

        phoneInput.addEventListener(
            'blur',
            () => validateField(form, 'phone')
        );
    }

    if (emailInput) {
        emailInput.addEventListener(
            'blur',
            () => validateField(form, 'email')
        );

        emailInput.addEventListener(
            'input',
            () => {
                if (emailInput.getAttribute('aria-invalid') === 'true') {
                    validateField(form, 'email');
                }
            }
        );
    }

    if (commentInput) {
        commentInput.addEventListener(
            'input',
            () => {
                updateCommentCounter(form);

                if (
                    commentInput.getAttribute('aria-invalid') === 'true'
                ) {
                    validateField(form, 'comment');
                }
            }
        );

        updateCommentCounter(form);
    }

    const agreementInput =
        form.elements.agreement;

    if (agreementInput) {
        agreementInput.addEventListener(
            'change',
            () => validateField(form, 'agreement')
        );
    }
}


/**
 * Обрабатывает ввод телефона.
 *
 * @param {Event} event
 * @returns {void}
 */
function handlePhoneInput(event) {
    const input = event.currentTarget;

    input.value = formatPhone(
        input.value
    );
}


/**
 * Форматирует российский номер телефона.
 *
 * @param {string} value
 * @returns {string}
 */
function formatPhone(value) {
    let digits = value.replace(/\D/g, '');

    if (!digits) {
        return '';
    }

    if (digits.startsWith('8')) {
        digits = `7${digits.slice(1)}`;
    } else if (!digits.startsWith('7')) {
        digits = `7${digits}`;
    }

    digits = digits.slice(0, 11);

    const subscriber = digits.slice(1);

    let result = '+7';

    if (subscriber.length > 0) {
        result += ` (${subscriber.slice(0, 3)}`;
    }

    if (subscriber.length >= 3) {
        result += ')';
    }

    if (subscriber.length > 3) {
        result += ` ${subscriber.slice(3, 6)}`;
    }

    if (subscriber.length > 6) {
        result += `-${subscriber.slice(6, 8)}`;
    }

    if (subscriber.length > 8) {
        result += `-${subscriber.slice(8, 10)}`;
    }

    return result;
}


/**
 * Валидирует отдельное поле.
 *
 * @param {HTMLFormElement} form
 * @param {string} fieldName
 * @returns {boolean}
 */
function validateField(form, fieldName) {
    const input = form.elements[fieldName];

    if (!input) {
        return true;
    }

    const error = form.querySelector(
        `[data-field-error="${fieldName}"]`
    );

    if (!error) {
        return true;
    }

    let message = '';

    switch (fieldName) {
        case 'name':
            message = validateName(input);
            break;

        case 'phone':
            message = validatePhone(input);
            break;

        case 'email':
            message = validateEmail(input);
            break;

        case 'comment':
            message = validateComment(input);
            break;

        case 'agreement':
            message = validateAgreement(input);
            break;
    }

    input.setAttribute(
        'aria-invalid',
        message ? 'true' : 'false'
    );

    error.textContent = message;

    return !message;
}


/**
 * Валидирует имя.
 *
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function validateName(input) {
    const value = input.value.trim();

    input.value = value;

    if (!value) {
        return 'Введите ваше имя.';
    }

    if (value.length < 2) {
        return 'Имя должно содержать минимум 2 символа.';
    }

    if (value.length > 50) {
        return 'Имя должно содержать не более 50 символов.';
    }

    return '';
}


/**
 * Валидирует телефон.
 *
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function validatePhone(input) {
    const digits = input.value.replace(
        /\D/g,
        ''
    );

    if (!digits) {
        return 'Введите номер телефона.';
    }

    if (
        digits.length !== 11 ||
        !digits.startsWith('7')
    ) {
        return 'Введите корректный номер телефона.';
    }

    return '';
}


/**
 * Валидирует email.
 *
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function validateEmail(input) {
    const value = input.value.trim();

    input.value = value;

    if (!value) {
        return 'Введите адрес электронной почты.';
    }

    if (!input.validity.valid) {
        return 'Введите корректный адрес электронной почты.';
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(value)) {
        return 'Введите полный адрес электронной почты.';
    }

    return '';
}


/**
 * Валидирует комментарий.
 *
 * @param {HTMLTextAreaElement} input
 * @returns {string}
 */
function validateComment(input) {
    const value = input.value.trim();

    if (value.length > 1000) {
        return 'Комментарий не должен превышать 1000 символов.';
    }

    return '';
}


/**
 * Валидирует согласие.
 *
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function validateAgreement(input) {
    if (!input.checked) {
        return 'Необходимо согласиться на обработку персональных данных.';
    }

    return '';
}


/**
 * Валидирует всю форму.
 *
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateOrderForm(form) {
    const fields = [
        'name',
        'phone',
        'email',
        'comment',
        'agreement',
    ];

    let isValid = true;
    let firstInvalidField = null;

    fields.forEach((fieldName) => {
        const valid = validateField(
            form,
            fieldName
        );

        if (!valid) {
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField =
                    form.elements[fieldName];
            }
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
    }

    return isValid;
}


/**
 * Обновляет счётчик комментария.
 *
 * @param {HTMLFormElement} form
 * @returns {void}
 */
function updateCommentCounter(form) {
    const comment =
        form.elements.comment;

    const counter =
        form.querySelector(
            '[data-comment-counter]'
        );

    if (!comment || !counter) {
        return;
    }

    counter.textContent =
        `${comment.value.length} / 1000`;
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
    const content = document.querySelector(
        '[data-cart-content]'
    );

    const empty = document.querySelector(
        '[data-cart-empty]'
    );

    if (!content || !empty) {
        return;
    }

    const cart = getCart();

    const validCart = cart.filter(
        (item) => getProduct(item.id)
    );

    if (validCart.length !== cart.length) {
        saveCart(validCart);
    }

    // Корзина пуста — показываем только пустое состояние.
    if (validCart.length === 0) {
        content.hidden = true;
        empty.hidden = false;
        return;
    }

    // Есть товары — показываем корзину и скрываем пустое состояние.
    empty.hidden = true;
    content.hidden = false;

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

    clearOrderMessages(form);

    if (!validateOrderForm(form)) {
        return;
    }

    const website =
        form.elements.website?.value.trim();

    if (website) {
        return;
    }

    const cart = getCart();

    if (!cart.length) {
        return;
    }

    const submitButton =
        form.querySelector(
            '[type="submit"]'
        );

    setSubmitLoading(
        submitButton,
        true
    );

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
 * Очищает сообщения формы.
 *
 * @param {HTMLFormElement} form
 * @returns {void}
 */
function clearOrderMessages(form) {
    const generalError =
        form.querySelector(
            '[data-cart-order-error]'
        );

    const success =
        form.querySelector(
            '[data-cart-order-success]'
        );

    if (generalError) {
        generalError.textContent = '';
        generalError.hidden = true;
    }

    if (success) {
        success.textContent = '';
        success.hidden = true;
    }
}


/**
 * Переключает состояние кнопки отправки.
 *
 * @param {HTMLButtonElement|null} button
 * @param {boolean} loading
 * @returns {void}
 */
function setSubmitLoading(button, loading) {
    if (!button) {
        return;
    }

    if (loading) {
        button.disabled = true;
        button.dataset.defaultText =
            button.textContent.trim();
        button.textContent =
            'Оформление...';

        return;
    }

    button.disabled = false;

    if (button.dataset.defaultText) {
        button.textContent =
            button.dataset.defaultText;
    }
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
