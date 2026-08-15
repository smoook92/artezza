const API_URL = '/wp-json/catalog/v1';

export async function fetchCatalogData() {
    const response = await fetch(
        `${API_URL}/catalog`,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Catalog API error: ${response.status}`
        );
    }

    return response.json();
}