/**
 * Catalog side panel.
 *
 * Opens and closes the catalog panel.
 */
export function initCatalogPanel() {
    const panel = document.querySelector('#catalog-panel');
    const overlay = panel?.querySelector('.catalog-panel__overlay');
    const closeButton = panel?.querySelector('.catalog-panel__close');
    const catalogLinks = document.querySelectorAll(
        '.site-header__catalog-toggle.catalog-panel__open'
    );

    if (!panel || !catalogLinks.length) {
        return;
    }

    let previousFocus = null;

    /**
     * Changes the panel visibility.
     */
    const setPanelState = (open) => {
        panel.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('catalog-panel-open', open);

        if (open) {
            previousFocus = document.activeElement;
            closeButton?.focus();
            return;
        }

        previousFocus?.focus?.();
    };

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