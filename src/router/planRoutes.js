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
    {
        path: "/plans/:planId",
        name: "getPlanDetail",
        component: () => import("@/views/plan/getPlansListPage.vue"),
        props: true,
    },
];
