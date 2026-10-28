/**
 * Mobile navigation menu.
 *
 * The mobile menu and desktop catalog panel have separate triggers and
 * cannot be open at the same time.
 *
 * @returns {void}
 */
export function initMobileMenu() {
    const header = document.querySelector('.site-header');
    const toggle = header?.querySelector('.site-header__menu-toggle');
    const menu = header?.querySelector('#mobile-menu');
    const closeButton = menu?.querySelector('.mobile-menu__close');

    if (!header || !toggle || !menu || !closeButton) {
        return;
    }

    const mediaQuery = window.matchMedia('(max-width: 991px)');
    const links = menu.querySelectorAll('a');
    let isOpen = false;

    const openMenu = () => {
        if (!mediaQuery.matches || isOpen) {
            return;
        }

        // Defensive: close the desktop catalog panel if it was left open
        // before the viewport crossed the breakpoint.
        const catalogPanel = document.querySelector('#catalog-panel');
        if (catalogPanel?.getAttribute('aria-hidden') === 'false') {
            catalogPanel.querySelector('.catalog-panel__close')?.click();
        }

        isOpen = true;
        header.classList.add('mobile-menu-is-open');
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Закрыть меню');
        document.body.classList.add('menu-open');
        closeButton.focus();
    };

    const closeMenu = (returnFocus = true) => {
        if (!isOpen) {
            return;
        }

        isOpen = false;
        header.classList.remove('mobile-menu-is-open');
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Открыть меню');
        document.body.classList.remove('menu-open');

        if (returnFocus && mediaQuery.matches) {
            toggle.focus();
        }
    };

    toggle.addEventListener('click', (event) => {
        if (!mediaQuery.matches) {
            return;
        }

        event.preventDefault();
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    closeButton.addEventListener('click', () => closeMenu());

    document.addEventListener('keydown', (event) => {
        if (!isOpen) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusable = [...menu.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )].filter((element) => !element.hasAttribute('hidden'));

        if (!focusable.length) {
            event.preventDefault();
            closeButton.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!isOpen || !(event.target instanceof Node)) {
            return;
        }

        if (!header.contains(event.target)) {
            closeMenu(false);
        }
    });

    links.forEach((link) => {
        link.addEventListener('click', () => closeMenu(false));
    });

    const handleBreakpointChange = (event) => {
        if (!event.matches) {
            closeMenu(false);
        }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleBreakpointChange);
    } else {
        mediaQuery.addListener(handleBreakpointChange);
    }

    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('menu-open');
}
