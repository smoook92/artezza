import { initHeader } from './components/header.js';
import { initCatalog } from './pages/catalog.js';
import { initContactForm } from './sections/contact.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
	 initCatalog();
	 initContactForm();
});
