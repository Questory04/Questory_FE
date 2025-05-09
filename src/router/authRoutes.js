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
];
