import { initNavigation } from './navigation.js';
import { initMobileMenu } from './mobile-menu.js';
import { initCatalogPanel } from './catalog-panel.js?v=2';

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
    initDesktopStickyNavigation();
}

/**
 * On desktop, pin the lower navigation only after the top information bar
 * has fully scrolled out of view. Mobile behavior remains unchanged.
 *
 * @returns {void}
 */
function initDesktopStickyNavigation() {
    const header = document.querySelector('.site-header');
    const topBar = header?.querySelector('.site-header__top');

    if (!header || !topBar) {
        return;
    }

    const desktopQuery = window.matchMedia('(min-width: 992px)');

    const updateStickyState = () => {
        if (!desktopQuery.matches) {
            header.classList.remove('site-header--nav-sticky');
            return;
        }

        header.classList.toggle(
            'site-header--nav-sticky',
            topBar.getBoundingClientRect().bottom <= 0
        );
    };

    window.addEventListener('scroll', updateStickyState, { passive: true });
    window.addEventListener('resize', updateStickyState);

    if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', updateStickyState);
    } else {
        desktopQuery.addListener(updateStickyState);
    }

    updateStickyState();
}
