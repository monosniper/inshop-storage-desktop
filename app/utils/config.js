export const $routes = {
    index: '/',
    wallet: '/wallet',
    storage: {
        index: '/storage',
        categories: '/storage/categories',
    },
    clients: '/clients',
    library: {
        index: '/library',
        module: (slug) => `/library/${slug}`,
    },
    store: {
        index: '/store',
        module: (slug) => `/store/${slug}`
    }
}