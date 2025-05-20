export default [
    {
        path: "/quests",
        name: "quests",
        component: () => import("@/views/quest/GetQuestsListPage.vue"),
    },
    {
        path: "/add-quest",
        name: "add-quest",
        component: () => import("@/views/quest/AddQuestPage.vue"),
    },
    {
        path: "/modify-quest",
        name: "modify-quest",
        component: () => import("@/views/quest/ModifyQuestPage.vue"),
    },
];
