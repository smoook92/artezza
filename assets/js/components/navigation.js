/**
 * Desktop navigation.
 *
 * Handles dropdown menus, accessibility state and outside interactions.
 *
 * @returns {void}
 */
export function initNavigation() {
    const navigation = document.querySelector('.site-header__navigation');

    if (!navigation) {
        return;
    }

    const items = [
        ...navigation.querySelectorAll('.site-header__item--has-dropdown')
    ];

    if (!items.length) {
        return;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const getButton = (item) => (
        item.querySelector(':scope > button')
    );

    const getDropdown = (item) => (
        item.querySelector(':scope > .site-header__dropdown')
    );

    /**
     * @param {HTMLElement} item
     * @param {boolean} open
     */
    const setItemState = (item, open) => {
        const button = getButton(item);
        const dropdown = getDropdown(item);

        if (!button || !dropdown) {
            return;
        }

        item.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));

        dropdown.setAttribute('aria-hidden', String(!open));
    };

    /**
     * Close every dropdown except the provided item.
     *
     * @param {HTMLElement|null} except
     * @returns {void}
     */
    const closeAll = (except = null) => {
        items.forEach((item) => {
            if (item !== except) {
                setItemState(item, false);
            }
        });
    };

    /**
     * @param {HTMLElement} item
     * @returns {void}
     */
    const toggleItem = (item) => {
        const button = getButton(item);

        if (!button) {
            return;
        }

        const isOpen = item.classList.contains('is-open');

        closeAll(item);
        setItemState(item, !isOpen);
    };

    /**
     * @param {HTMLElement} item
     * @returns {void}
     */
    const openItem = (item) => {
        closeAll(item);
        setItemState(item, true);
    };

    /**
     * @returns {void}
     */
    const closeNavigation = () => {
        closeAll();
    };

    items.forEach((item) => {
        const button = getButton(item);

        if (!button) {
            return;
        }

        button.setAttribute('aria-expanded', 'false');

        const dropdown = getDropdown(item);

        if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
        }

        button.addEventListener('click', (event) => {
            if (!mediaQuery.matches) {
                return;
            }

            event.preventDefault();
            toggleItem(item);
        });

        item.addEventListener('mouseenter', () => {
            if (!mediaQuery.matches) {
                return;
            }

            openItem(item);
        });

        item.addEventListener('mouseleave', () => {
            if (!mediaQuery.matches) {
                return;
            }

            setItemState(item, false);
        });

        item.addEventListener('focusin', () => {
            if (!mediaQuery.matches) {
                return;
            }

            openItem(item);
        });
    });

    navigation.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
            return;
        }

        const openItemElement = navigation.querySelector(
            '.site-header__item--has-dropdown.is-open'
        );

        closeNavigation();

        if (openItemElement) {
            getButton(openItemElement)?.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target)) {
            closeNavigation();
        }
    });

    document.addEventListener('focusin', (event) => {
        if (!navigation.contains(event.target)) {
            closeNavigation();
        }
    });

    const handleBreakpointChange = (event) => {
        if (!event.matches) {
            closeNavigation();
        }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleBreakpointChange);
    } else {
        mediaQuery.addListener(handleBreakpointChange);
    }
}