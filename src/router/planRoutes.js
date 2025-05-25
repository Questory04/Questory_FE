export default [
    {
        path: '/plans/create',
        name: 'PlanCreateForm',
        component: () => import("@/views/plan/PlanCreatePage.vue"),
    },
    {
        // path: '/plans/:planId/edit',
        path: '/plans/edit',
        name: 'PlanRouteEditor',
        component: () => import("@/views/plan/PlanRouteEditor.vue"),
        props: true,
    },
];
