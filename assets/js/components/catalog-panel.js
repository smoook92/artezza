/**
 * Catalog side panel.
 *
 * Opens the panel and controls category submenus.
 */
export function initCatalogPanel() {
    const panel = document.querySelector('#catalog-panel');
    const overlay = panel?.querySelector('.catalog-panel__overlay');
    const closeButton = panel?.querySelector('.catalog-panel__close');
    const catalogLinks = document.querySelectorAll(
        '.site-header__catalog-toggle.catalog-panel__open'
    );
    const categories = panel?.querySelectorAll('.catalog-panel__category');
    const canHover = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    ).matches;

    if (!panel || !catalogLinks.length) {
        return;
    }

    let previousFocus = null;

    const setPanelState = (open) => {
        panel.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('catalog-panel-open', open);

        if (open) {
            previousFocus = document.activeElement;
            closeButton?.focus();
            return;
        }

        closeAllSubmenus();
        previousFocus?.focus?.();
    };

    const setSubmenuState = (category, open) => {
        const trigger = category.querySelector(
            '.catalog-panel__category-trigger'
        );

        trigger?.setAttribute('aria-expanded', String(open));

        panel.querySelector('.catalog-panel__content')
            ?.classList.toggle('has-active-submenu', open);
    };

    const closeAllSubmenus = (except = null) => {
        categories?.forEach((category) => {
            if (category !== except) {
                setSubmenuState(category, false);
            }
        });
    };

    categories?.forEach((category) => {
        const trigger = category.querySelector(
            '.catalog-panel__category-trigger'
        );

        if (!trigger) {
            return;
        }

        if (canHover) {
            category.addEventListener('pointerenter', () => {
                closeAllSubmenus(category);
                setSubmenuState(category, true);
            });

        category.addEventListener('pointerleave', (event) => {
            if (category.contains(event.relatedTarget)) {
                return;
            }

            setSubmenuState(category, false);
        });

        }

        category.addEventListener('focusin', (event) => {
            if (!event.target.matches(':focus-visible')) {
                return;
            }

            closeAllSubmenus(category);
            setSubmenuState(category, true);
        });

        category.addEventListener('focusout', (event) => {
            if (!category.contains(event.relatedTarget)) {
                setSubmenuState(category, false);
            }
        });

        trigger.addEventListener('click', (event) => {
            if (event.detail === 0) {
                return;
            }

            if (canHover && event.detail !== 0) {
                return;
            }

            const isExpanded =
                trigger.getAttribute('aria-expanded') === 'true';

            closeAllSubmenus();

            setSubmenuState(category, !isExpanded);
        });
    });

    catalogLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setPanelState(true);
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