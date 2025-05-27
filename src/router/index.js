import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./authRoutes";
import boardRoutes from "./boardRoutes";
import mainRoutes from "./mainRoutes";
import planRoutes from "./planRoutes";
import stampRoutes from "./stampRoutes";
import questRoutes from "./questRoutes";
import rankingRoutes from "./rankingRoutes";
import friendRoutes from "./friendRoutes";

const routes = [
    ...authRoutes,
    ...boardRoutes,
    ...mainRoutes,
    ...planRoutes,
    ...stampRoutes,
    ...questRoutes,
    ...rankingRoutes,
    ...friendRoutes,
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
