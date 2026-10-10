import { initNavigation } from './navigation.js';
import { initMobileMenu } from './mobile-menu.js';
import { initCatalogPanel } from './catalog-panel.js';

/**
 * Initialize site header.
 *
 * @returns {void}
 */
export function initHeader() {
    const header = document.querySelector('.site-header');

    if (!header) {
        return;
    }

    initNavigation();
    initMobileMenu();
    initCatalogPanel();
}
