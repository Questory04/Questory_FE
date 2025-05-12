<template>
    <section class="section popular-routes">
        <BasicTitle msg="인기 여행 루트" />
        <Swiper
            :slides-per-view="1.2"
            :space-between="12"
            :breakpoints="{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3 },
            }"
        >
            <SwiperSlide v-for="n in 5" :key="n">
                <div class="card">
                    <h3>서울 도심 속 감성 산책</h3>
                    <p>소요 시간: 3시간</p>
                    <p>장소: 3곳</p>
                    <p>강남 → 북촌 → 익선동</p>
                    <button>따라가기</button>
                </div>
            </SwiperSlide>
        </Swiper>
    </section>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import BasicTitle from "../common/BasicTitle.vue";

export default {
    name: "PopularRoutes",
    components: {
        Swiper,
        SwiperSlide,
        BasicTitle,
    },
};
</script>

<style scoped>
.section {
    margin-bottom: 20px;
}

.card {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px #ddd;
    height: 100%;
    border: 1px solid #b5b5b5;
    box-shadow: rgba(0, 0, 0, 0.35) 10px 10px 15px;
}

.card button {
    margin-top: 10px;
    background: #7db4d5;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
}
</style>
