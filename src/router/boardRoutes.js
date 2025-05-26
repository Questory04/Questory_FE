export default [
    {
        path: "/boards",
        name: "boards",
        component: () => import("@/views/community/BoardListPage.vue"),
    },
    {
        path: "/boards/write",
        name: "boardsWrite",
        component: () => import("@/views/community/BoardWritePage.vue"),
    },
    {
        path: "/boards/me",
        name: "MyPost",
        component: () => import("@/views/community/MyPostsPage.vue"),
    },
    {
        path: '/boards/:id',
        name: 'BoardDetail',
        component: () => import("@/views/community/BoardDetailPage.vue"),
        props: true
    },
    {
        path: '/boards/notice',
        name: 'BoardNotice',
        component: () => import("@/views/community/NoticeListPage.vue"),
        props: true
    },
    {
        path: '/boards/notice/:id',
        name: 'NoticeDetail',
        component: () => import('@/views/community/NoticeDetailPage.vue') 
    },
    {
        path: '/boards/edit/:id',
        name: 'NoticeEdit',
        component: () => import('@/views/community/BoardEditPage.vue') 
    }
];
