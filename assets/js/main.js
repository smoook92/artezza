import { initHeader } from './components/header.js';
import { initCatalogPanel } from './components/catalog-panel.js';
import { initCatalog } from './pages/catalog.js';
import { initContactForm } from './sections/contact.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
	initCatalogPanel();
	 initCatalog();
	 initContactForm();
});
