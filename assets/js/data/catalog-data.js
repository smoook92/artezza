import { catalogProducts } from './catalog-products.js';
import { catalogCategories } from './catalog-categories.js';
import { FILTERS } from './catalog-filters.js';
import { catalogEffects } from './catalog-effects.js';


export async function getCatalogData() {
    return {
        products: catalogProducts,
        categories: catalogCategories,
        filters: FILTERS,
        effects: catalogEffects,
    };
}