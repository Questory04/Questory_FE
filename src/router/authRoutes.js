export default [
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/auth/LoginPage.vue"),
    },
    {
        path: "/signup",
        name: "signup",
        component: () => import("@/views/auth/SignupPage.vue"),
    },
    {
        path: "/find-password",
        name: "find-password",
        component: () => import("@/views/auth/PasswordFindPage.vue"),
    },
    {
        path: "/mypage",
        name: "mypage",
        component: () => import("@/views/auth/MypagePage.vue"),
    },
];
