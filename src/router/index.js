import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./authRoutes";

const routes = [
    ...authRoutes,
    // 공통 페이지 추가
    // {
    //     path: "/:pathMatch(.*)*",
    //     name: "not-found",
    //     component: () => import("../views/NotFoundPage.vue"),
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
