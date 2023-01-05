export const $routes = {
    storage: {
        index: '/storage',
        categories: '/storage/categories',
    },
    clients: '/clients',
    store: {
        index: '/store',
        module: (slug) => `/store/${slug}`
    }
}