import { Skeleton } from '../components/skeleton.js';

const container = document.querySelector('#skeleton-preview');
const status = document.querySelector('#skeleton-status');

const COUNTS = {
    'product-card': 3,
    'portfolio-card': 3,
    'review-card': 2,
    image: 1,
    text: 1,
};

document.querySelectorAll('[data-skeleton-type]').forEach((button) => {
    button.addEventListener('click', () => {
        const type = button.dataset.skeletonType;

        Skeleton.show(container, {
            type,
            count: COUNTS[type],
        });

        status.textContent = `Предпросмотр: ${button.textContent}.`;
    });
});
