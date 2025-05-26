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
        path: "/plans",
        name: "getPlansList",
        component: () => import("@/views/plan/getPlansListPage.vue"),
        props: true,
    },
    {
        path: "/plans/:planId",
        name: "getPlanDetail",
        component: () => import("@/views/plan/getPlanDetailPage.vue"),
        props: true,
    },
    {
        path: "/plans/all",
        name: "getTotalPlanList",
        component: () => import("@/views/plan/GetTotalPlansListPage.vue"),
        props: true,
    },
];
