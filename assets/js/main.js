import { initHeader } from './components/header.js';
import { initCatalog } from './pages/catalog.js';
import { initContactForm } from './sections/contact.js';

document.addEventListener('DOMContentLoaded', () => {
    const initializers = [
        initHeader,
        initCatalog,
        initContactForm,
    ];

    initializers.forEach((initialize) => {
        try {
            initialize();
        } catch (error) {
            console.error(
                `Ошибка инициализации ${initialize.name}:`,
                error
            );
        }
    });
});
