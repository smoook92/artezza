document.addEventListener(
    'DOMContentLoaded',
    initOrderSuccess
);


/**
 * Инициализирует страницу успешного заказа.
 *
 * @returns {void}
 */
function initOrderSuccess() {
    const orderNumber = sessionStorage.getItem(
        'artezza_order_number'
    );

    const element = document.querySelector(
        '[data-order-number]'
    );

    if (!element) {
        return;
    }

    if (!orderNumber) {
        element.textContent = '—';
        return;
    }

    element.textContent = orderNumber;
}