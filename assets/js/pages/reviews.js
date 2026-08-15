import { reviewsData } from '../data/reviews-data.js';

document.addEventListener('DOMContentLoaded', () => {
    initReviews();
});

/**
 * Инициализирует страницу отзывов.
 *
 * @returns {void}
 */
function initReviews() {
    const page = document.querySelector('.reviews-page');

    if (!page) {
        return;
    }

    renderReviews(reviewsData);
}

/**
 * Отображает список отзывов.
 *
 * @param {Array} reviews
 * @returns {void}
 */
function renderReviews(reviews) {
    const container = document.querySelector(
        '[data-reviews-list]'
    );

    const emptyState = document.querySelector(
        '[data-reviews-empty]'
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    if (!reviews.length) {
        if (emptyState) {
            emptyState.hidden = false;
        }

        updateReviewsSummary([]);
        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    reviews.forEach((review) => {
        container.appendChild(
            createReviewCard(review)
        );
    });

    updateReviewsSummary(reviews);
}

/**
 * Создаёт карточку отзыва.
 *
 * @param {Object} review
 * @returns {HTMLElement}
 */
function createReviewCard(review) {
    const article = document.createElement('article');

    article.className = 'review-card';

    article.innerHTML = `
        <div class="review-card__header">

            <div class="review-card__author">
                <strong class="review-card__name">
                    ${escapeHtml(review.author)}
                </strong>

                <span class="review-card__city">
                    ${escapeHtml(review.city)}
                </span>
            </div>

            <time
                class="review-card__date"
                datetime="${escapeHtml(review.date)}"
            >
                ${formatDate(review.date)}
            </time>

        </div>

        <div
            class="review-card__rating"
            aria-label="Оценка: ${review.rating} из 5"
        >
            ${renderStars(review.rating)}
        </div>

        <p class="review-card__text">
            ${escapeHtml(review.text)}
        </p>
    `;

    return article;
}

/**
 * Обновляет общий рейтинг и количество отзывов.
 *
 * @param {Array} reviews
 * @returns {void}
 */
function updateReviewsSummary(reviews) {
    const ratingElement = document.querySelector(
        '[data-reviews-rating]'
    );

    const countElement = document.querySelector(
        '[data-reviews-count]'
    );

    if (!reviews.length) {
        setText(ratingElement, '0.0');
        setText(countElement, '0 отзывов');

        return;
    }

    const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    const averageRating = (
        totalRating / reviews.length
    ).toFixed(1);

    setText(
        ratingElement,
        averageRating
    );

    setText(
        countElement,
        getReviewsCountText(reviews.length)
    );
}

/**
 * Создаёт визуальный рейтинг.
 *
 * @param {number} rating
 * @returns {string}
 */
function renderStars(rating) {
    return Array.from(
        { length: 5 },
        (_, index) => (
            index < rating ? '★' : '☆'
        )
    ).join('');
}

/**
 * Форматирует дату отзыва.
 *
 * @param {string} date
 * @returns {string}
 */
function formatDate(date) {
    return new Intl.DateTimeFormat(
        'ru-RU',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }
    ).format(new Date(date));
}

/**
 * Возвращает правильное склонение слова «отзыв».
 *
 * @param {number} count
 * @returns {string}
 */
function getReviewsCountText(count) {
    if (count === 1) {
        return '1 отзыв';
    }

    if (count >= 2 && count <= 4) {
        return `${count} отзыва`;
    }

    return `${count} отзывов`;
}

/**
 * Устанавливает текст элемента.
 *
 * @param {HTMLElement|null} element
 * @param {string} value
 * @returns {void}
 */
function setText(element, value) {
    if (!element) {
        return;
    }

    element.textContent = value;
}

/**
 * Экранирует HTML.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}