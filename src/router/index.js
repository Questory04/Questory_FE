import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./authRoutes";
import mainRoutes from "./mainRoutes";
import stampRoutes from "./stampRoutes";
import questRoutes from "./questRoutes";

const routes = [
    ...authRoutes,
    ...mainRoutes,
    ...stampRoutes,
    ...questRoutes,
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
