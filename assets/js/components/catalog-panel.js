/**
 * Catalog side panel.
 *
 * Opens only on desktop. The mobile menu uses its own toggle and content.
 */
export function initCatalogPanel() {
    const panel = document.querySelector('#catalog-panel');
    const content = panel?.querySelector('.catalog-panel__content');
    const overlay = panel?.querySelector('.catalog-panel__overlay');
    const closeButton = panel?.querySelector('.catalog-panel__close');
    const catalogLinks = document.querySelectorAll(
        '.site-header__catalog-toggle.catalog-panel__open'
    );

    if (!panel || !content || !catalogLinks.length) {
        return;
    }

    const categories = [...panel.querySelectorAll('.catalog-panel__category')];
    const desktopQuery = window.matchMedia('(min-width: 992px)');
    let previousFocus = null;

    const setPanelState = (open) => {
        if (open && !desktopQuery.matches) {
            return;
        }

        panel.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('catalog-panel-open', open);
        catalogLinks.forEach((button) => {
            button.setAttribute('aria-expanded', String(open));
        });

        if (open) {
            previousFocus = document.activeElement;
            closeButton?.focus();
        } else {
            categories.forEach((category) => {
                category.classList.remove('is-active');
                category.querySelector('.catalog-panel__category-trigger')
                    ?.setAttribute('aria-expanded', 'false');
            });

            if (previousFocus && desktopQuery.matches) {
                previousFocus.focus?.();
            }
            previousFocus = null;
        }
    };

    const activateCategory = (activeCategory) => {
        categories.forEach((category) => {
            const active = category === activeCategory;
            category.classList.toggle('is-active', active);
            category.querySelector('.catalog-panel__category-trigger')
                ?.setAttribute('aria-expanded', String(active));
        });
    };

    catalogLinks.forEach((button) => {
        button.addEventListener('click', (event) => {
            if (!desktopQuery.matches) {
                return;
            }

            event.preventDefault();
            setPanelState(panel.getAttribute('aria-hidden') !== 'false');
            if (panel.getAttribute('aria-hidden') === 'false' && categories.length) {
                activateCategory(categories[0]);
            }
        });
    });

    categories.forEach((category) => {
        const trigger = category.querySelector('.catalog-panel__category-trigger');

        trigger?.addEventListener('mouseenter', () => {
            if (desktopQuery.matches) activateCategory(category);
        });

        trigger?.addEventListener('focus', () => {
            if (desktopQuery.matches) activateCategory(category);
        });

        trigger?.addEventListener('click', () => {
            if (!desktopQuery.matches) return;

            if (category.classList.contains('is-active')) {
                category.classList.remove('is-active');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                activateCategory(category);
            }
        });
    });

    closeButton?.addEventListener('click', () => setPanelState(false));
    overlay?.addEventListener('click', () => setPanelState(false));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
            setPanelState(false);
        }
    });

    const handleBreakpointChange = (event) => {
        if (!event.matches && panel.getAttribute('aria-hidden') === 'false') {
            setPanelState(false);
        }
    };

    if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', handleBreakpointChange);
    } else {
        desktopQuery.addListener(handleBreakpointChange);
    }

    panel.setAttribute('aria-hidden', 'true');
    catalogLinks.forEach((button) => button.setAttribute('aria-expanded', 'false'));
}
