/**
 * Catalog side panel.
 *
 * Opens the catalog panel, switches categories on hover
 * and closes the panel on outside click or Escape.
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

    const categories = [
        ...panel.querySelectorAll('.catalog-panel__category')
    ];

    const desktopQuery = window.matchMedia('(min-width: 992px)');
    let previousFocus = null;

    /**
     * Opens or closes the panel.
     */
    const setPanelState = (open) => {
        panel.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('catalog-panel-open', open);

        if (open) {
            previousFocus = document.activeElement;
            closeButton?.focus();
        } else {
            categories.forEach((category) => {
                category.classList.remove('is-active');

                category
                    .querySelector('.catalog-panel__category-trigger')
                    ?.setAttribute('aria-expanded', 'false');
            });

            previousFocus?.focus?.();
        }
    };

    /**
     * Activates a category and its submenu.
     */
    const activateCategory = (activeCategory) => {
        categories.forEach((category) => {
            const active = category === activeCategory;

            category.classList.toggle('is-active', active);

            category
                .querySelector('.catalog-panel__category-trigger')
                ?.setAttribute('aria-expanded', String(active));
        });
    };

    // Open the panel instead of navigating to catalog.html.
    catalogLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setPanelState(true);
    
            if (categories.length) {
                activateCategory(categories[0]);
            }
        });
    });

    // Switch categories on hover on desktop.
    categories.forEach((category) => {
        const trigger = category.querySelector(
            '.catalog-panel__category-trigger'
        );

        trigger?.addEventListener('mouseenter', () => {
            if (desktopQuery.matches) {
                activateCategory(category);
            }
        });

        trigger?.addEventListener('focus', () => {
            if (desktopQuery.matches) {
                activateCategory(category);
            }
        });

        // Open or collapse categories on mobile and tablet.
        trigger?.addEventListener('click', () => {
            if (desktopQuery.matches) {
                activateCategory(category);
                return;
            }

            const isActive = category.classList.contains('is-active');

            if (isActive) {
                category.classList.remove('is-active');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                activateCategory(category);
            }
        });
    });

    closeButton?.addEventListener('click', () => {
        setPanelState(false);
    });

    overlay?.addEventListener('click', () => {
        setPanelState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            panel.getAttribute('aria-hidden') === 'false'
        ) {
            setPanelState(false);
        }
    });
}
