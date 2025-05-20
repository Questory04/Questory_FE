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
        path: "/edit-profile",
        name: "edit-profile",
        component: () => import("@/views/auth/EditProfilePage.vue"),
    },
    {
        path: "/edit-password",
        name: "edit-password",
        component: () => import("@/views/auth/EditPasswordPage.vue"),
    },
    {
        path: "/mypage",
        name: "mypage",
        component: () => import("@/views/auth/MypagePage.vue"),
    },
];
