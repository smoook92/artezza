import { getCatalogData } from '../data/catalog-data.js';
import {
    createEffectCard,
    renderEffectsMenu,
} from '../components/EffectCard.js';


document.addEventListener('DOMContentLoaded', initEffects);


/**
 * Инициализация страницы эффектов.
 *
 * @returns {Promise<void>}
 */
async function initEffects() {
    const container = document.querySelector(
        '[data-effects-list]'
    );

    if (!container) {
        return;
    }

    try {
        const catalogData = await getCatalogData();

        renderEffects(
            container,
            catalogData.effects
        );

        renderHeaderEffectsMenu(
            catalogData.effects
        );
    } catch (error) {
        console.error(
            'Ошибка загрузки эффектов:',
            error
        );

        renderEffectsError(container);
    }
}


/**
 * Рендерит карточки эффектов.
 *
 * @param {HTMLElement} container
 * @param {Array} effects
 * @returns {void}
 */
function renderEffects(container, effects) {
    if (!effects.length) {
        renderEmptyState(container);
        return;
    }

    container.replaceChildren(
        ...effects.map(createEffectCard)
    );
}


/**
 * Рендерит эффекты в выпадающее меню Header.
 *
 * @param {Array} effects
 * @returns {void}
 */
function renderHeaderEffectsMenu(effects) {
    const containers = document.querySelectorAll(
        '[data-effects-menu]'
    );

    containers.forEach((container) => {
        renderEffectsMenu(
            container,
            effects
        );
    });
}


/**
 * Состояние пустого каталога.
 *
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderEmptyState(container) {
    container.innerHTML = `
        <div class="effects-empty">
            <h2 class="effects-empty__title">
                Эффекты пока не добавлены
            </h2>

            <p class="effects-empty__description">
                В каталоге пока нет доступных декоративных эффектов.
            </p>
        </div>
    `;
}


/**
 * Состояние ошибки загрузки.
 *
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderEffectsError(container) {
    container.innerHTML = `
        <div class="effects-empty">
            <h2 class="effects-empty__title">
                Не удалось загрузить эффекты
            </h2>

            <p class="effects-empty__description">
                Попробуйте обновить страницу.
            </p>
        </div>
    `;
}