export default [
    {
        path: "/quests",
        name: "quests",
        component: () => import("@/views/quest/GetQuestsListPage.vue"),
    },
    {
        path: "/quests/me/created",
        name: "quests-me-created",
        component: () => import("@/views/quest/GetMyQuestsListPage.vue"),
    },
    {
        path: "/add-quest",
        name: "add-quest",
        component: () => import("@/views/quest/AddQuestPage.vue"),
    },
    {
        path: "/modify-quest/:questId",
        name: "modify-quest",
        component: () => import("@/views/quest/ModifyQuestPage.vue"),
    },
];
