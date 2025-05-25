export default [
    {
        path: "/plans/create",
        name: "PlanCreateForm",
        component: () => import("@/views/plan/PlanCreatePage.vue"),
    },
    {
        // path: '/plans/:planId/edit',
        path: "/plans/edit",
        name: "PlanRouteEditor",
        component: () => import("@/views/plan/PlanRouteEditor.vue"),
        props: true,
    },
    {
        // path: '/plans/:planId/edit',
        path: "/plans/edit2",
        name: "PlanRouteEditor2",
        component: () => import("@/views/plan/PlanRouteEditorTest.vue"),
        props: true,
    },
    {
        // path: '/plans/:planId/edit',
        path: "/plans/:planId/edit4",
        name: "PlanRouteEditor3",
        component: () => import("@/views/plan/PlanRouteEditorTest.vue"),
        props: true,
    },
];
