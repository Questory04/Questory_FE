<template>
    <section class="section recommend-quests">
        <BasicTitle msg="추천 퀘스트" color="black" />
        <Swiper
            :slides-per-view="1"
            :space-between="16"
            :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 35 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
                1280: { slidesPerView: 4, spaceBetween: 45 },
            }"
        >
            <SwiperSlide v-for="n in 5" :key="n">
                <div class="card">
                    <img class="thumbnail" src="@/assets/images/street-bukchon.jpg" alt="북촌 한옥마을" />
                    <h3>북촌 한옥마을 탐방</h3>
                    <p>쉬움</p>
                    <p>예상 45분</p>
                    <p>종로구 북촌로</p>
                    <p>관광 + 문화</p>
                    <p>EXP +50 • 스탬프</p>
                    <button>시작하기</button>
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
    name: "QuestList",
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
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #b3b3b3;
    box-shadow: 6px 7px 8px rgb(0 0 0 / 20%);
}

.thumbnail {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 12px;
}

.card h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 6px 0;
}

.card p {
    font-size: 13px;
    margin: 2px 0;
    color: #444;
}

.card button {
    margin-top: 10px;
    background: #7db4d5;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    transition: background 0.2s ease;
}

.card button:hover {
    background: #5da0c4;
}

::v-deep(.swiper-horizontal) {
    padding: 0 1rem;
}

::v-deep(.swiper-wrapper) {
    padding: 1rem;
}
</style>
