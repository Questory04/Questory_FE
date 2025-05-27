<template>
    <div class="main-wrapper">
        <Banner />

        <div class="section-wrapper">
            <div class="left-block">
                <QuestList />
                <PopularRoutes />
            </div>
            <div class="right-block">
                <MyInfo />
                <Ranking />
            </div>
        </div>
    </div>
</template>

<script>
import Banner from "@/components/main/MainBanner.vue";
import QuestList from "@/components/main/QuestList.vue";
import PopularRoutes from "@/components/main/PopularRoutes.vue";
import MyInfo from "@/components/main/MyInfo.vue";
import Ranking from "@/components/main/SmallRanking.vue";

export default {
    name: "MainPage",
    components: {
        Banner,
        QuestList,
        PopularRoutes,
        MyInfo,
        Ranking,
    },
};
</script>

<style scoped>
.main-wrapper {
    width: 60vw;
    margin: 0 auto;
    padding: 20px;
}

.section-wrapper {
    display: flex;
    gap: 20px;
    margin-top: 40px;
    flex-wrap: wrap;
}

.left-block,
.right-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.left-block {
    flex: 3;
    min-width: 300px;
}

.right-block {
    flex: 1;
    min-width: 250px;
}

@media (max-width: 768px) {
    .main-wrapper {
        width: 90vw;
    }

    .section-wrapper {
        flex-direction: column;
    }
}

</style>
