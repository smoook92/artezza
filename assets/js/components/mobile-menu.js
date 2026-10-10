/**
 * Mobile navigation menu.
 *
 * @returns {void}
 */
export function initMobileMenu() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.site-header__menu-toggle');
    const menu = document.querySelector('#mobile-menu');

    if (!header || !toggle || !menu) {
        return;
    }

    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const links = menu.querySelectorAll('a');

    let isOpen = false;

    /**
     * Open mobile menu.
     *
     * @returns {void}
     */
    const openMenu = () => {
        if (!mediaQuery.matches || isOpen) {
            return;
        }

        isOpen = true;

        header.classList.add('mobile-menu-is-open');
        menu.classList.add('is-open');

        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Закрыть меню');

        menu.setAttribute('aria-hidden', 'false');

        document.body.classList.add('menu-open');

        const firstLink = menu.querySelector('a, button');

        firstLink?.focus();
    };

    /**
     * Close mobile menu.
     *
     * @param {boolean} returnFocus
     * @returns {void}
     */
    const closeMenu = (returnFocus = true) => {
        if (!isOpen) {
            return;
        }

        isOpen = false;

        header.classList.remove('mobile-menu-is-open');
        menu.classList.remove('is-open');

        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Открыть меню');

        menu.setAttribute('aria-hidden', 'true');

        document.body.classList.remove('menu-open');

        if (returnFocus) {
            toggle.focus();
        }
    };

    /**
     * Toggle menu state.
     *
     * @returns {void}
     */
    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    };

    toggle.addEventListener('click', toggleMenu);

    // проверка
console.log('[mobile-menu] Инициализирован', {
    toggle,
    menu,
    mediaQueryMatches: mediaQuery.matches,
});

toggle.addEventListener('click', () => {
    console.log('[mobile-menu] Клик по бургеру', {
        mediaQueryMatches: mediaQuery.matches,
    });
});
    //проверка

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isOpen) {
            return;
        }

        closeMenu();
    });

    document.addEventListener('click', (event) => {
        if (!isOpen) {
            return;
        }

        const target = event.target;

        if (!(target instanceof Node)) {
            return;
        }

        if (!header.contains(target)) {
            closeMenu();
        }
    });

    links.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu(false);
        });
    });

    const handleBreakpointChange = (event) => {
        if (event.matches) {
            return;
        }

        closeMenu(false);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleBreakpointChange);
    } else {
        mediaQuery.addListener(handleBreakpointChange);
    }

    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
}
