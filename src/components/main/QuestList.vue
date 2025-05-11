<template>
  <section class="section recommend-quests">
    <BasicTitle msg="추천 퀘스트" />
    <Swiper
      :slides-per-view="1.2"
      :space-between="12"
      :breakpoints="{
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3 }
      }"
    >
      <SwiperSlide v-for="n in 5" :key="n">
        <div class="card">
          <h3>북촌 한옥마을 탐방</h3>
          <p>쉬움</p>
          <p>예상 45분</p>
          <p>관광 + 문화</p>
          <p>EXP +50 / 스탬프</p>
          <button>시작하기</button>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import BasicTitle from '../common/BasicTitle.vue';

export default {
  name: "QuestList",
  components: {
    Swiper,
    SwiperSlide,
    BasicTitle
  }
};
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}

.card {
  background: #f4f4f4;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px #ddd;
  height: 100%;
}

.card button {
  margin-top: 10px;
  background: #7DB4D5;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
