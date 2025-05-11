<template>
  <div class="main-wrapper">
    <Banner />

    <div class="section-wrapper up-section">
      <div class="left">
        <QuestList />
      </div>
      <div class="right">
        <MyInfo />
      </div>
    </div>

    <div class="section-wrapper down-section">
      <div class="left">
        <PopularRoutes />
      </div>
      <div class="right">
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
    Ranking
  }
};
</script>

<style scoped>
.main-wrapper {
  padding: 20px;
}

.section-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.left {
  flex: 3;
  min-width: 300px;
}

.right {
  flex: 1;
  min-width: 250px;
}

@media (max-width: 768px) {
  .section-wrapper {
    flex-direction: column;
  }
}
</style>
