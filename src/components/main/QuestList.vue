<template>
    <section class="section recommend-quests">
        <BasicTitle msg="🧭 추천 퀘스트" color="black" />
        <Swiper
            :slides-per-view="1"
            :space-between="16"
            :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 35 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
                1280: { slidesPerView: 4, spaceBetween: 45 },
            }"
        >
            <SwiperSlide
                v-for="quest in recommendedQuests"
                :key="quest.questId"
            >
            <div class="card">
                <img class="thumbnail" src="@/assets/images/street-bukchon.jpg" alt="썸네일" />
                <h3>{{ quest.title }}</h3>
                <p>{{ quest.difficulty }}</p>
                <p>생성일: {{ quest.createdAt.slice(0, 10) }}</p>
                <p>참여 인원: {{ quest.participantCount }}명</p>
                <p>EXP +{{ quest.exp }} • 스탬프</p>
                <button>시작하기</button>
            </div>
            </SwiperSlide>  
        </Swiper>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import BasicTitle from "../common/BasicTitle.vue";

const recommendedQuests = ref([]);

// API 호출 함수
const fetchRecommendedQuests = async () => {
    try {
        const response = await axios.get("http://localhost:8080/quests/recommendation?limit=5");
        recommendedQuests.value = response.data;
    } catch (error) {
        console.error("추천 퀘스트 조회 실패", error);
    }
};

onMounted(() => {
    fetchRecommendedQuests();
});
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
