export default [
    {
        path: "/plans/create",
        name: "PlanCreateForm",
        component: () => import("@/views/plan/PlanCreatePage.vue"),
    },
    {
        path: "/plans/:planId/edit",
        name: "PlanRouteEditor",
        component: () => import("@/views/plan/PlanRouteEditor.vue"),
        props: true,
    },
];
