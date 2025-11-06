export default [
    {
        name: "users",
        list: "/users",
        show: "/users/:id",
        edit: "/users/:id/edit",
        create: "/users/create",
        meta: {
            canDelete: true,
        },
    },
    {
        name: "subscriptions",
        list: "/subscriptions",
        show: "/subscriptions/:id",
        edit: "/subscriptions/:id/edit",
        create: "/subscriptions/create",
        meta: {
            canDelete: true,
        },
    },

    // Financial
    {
        name: 'financial',
        meta: {
            label: "Financial"
        }
    },
    {
        name: "invoices",
        list: "/invoices",
        show: "/invoices/:id",
        edit: "/invoices/:id/edit",
        create: "/invoices/create",
        meta: {
            parent: 'financial',
            canDelete: true,
        },
    },
    {
        name: "credit_notes",
        list: "/credit_notes",
        show: "/credit_notes/:id",
        edit: "/credit_notes/:id/edit",
        create: "/credit_notes/create",
        meta: {
            parent: 'financial',
            canDelete: true,
        },
    },

    // Catalog
    {
        name: 'catalog',
        meta: {

            label: "Catalog"
        }
    },
    {
        name: "scripts",
        list: "/scripts",
        show: "/scripts/:id",
        edit: "/scripts/:id/edit",
        create: "/scripts/create",
        meta: {
            parent: 'catalog',
            canDelete: true,
        },
    },
    {
        name: "coupons",
        list: "/coupons",
        show: "/coupons/:id",
        edit: "/coupons/:id/edit",
        create: "/coupons/create",
        meta: {
            parent: 'catalog',
            canDelete: true,
        },
    },
]