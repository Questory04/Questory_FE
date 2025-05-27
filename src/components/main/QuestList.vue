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
            <SwiperSlide v-for="quest in recommendedQuests" :key="quest.questId">
                <div class="card">
                    <img class="thumbnail" src="@/assets/images/street-bukchon.jpg" alt="썸네일" />
                    <h3>{{ quest.title }}</h3>
                    <p>{{ quest.difficulty }}</p>
                    <p>생성일: {{ quest.createdAt.slice(0, 10) }}</p>
                    <p>참여 인원: {{ quest.participantCount }}명</p>
                    <p>EXP +{{ quest.exp }} • 스탬프</p>
                    <button @click="handleStartClick(quest.questId)">시작하기</button>
                </div>
            </SwiperSlide>
        </Swiper>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import BasicTitle from "../common/BasicTitle.vue";

const API_URL = "http://localhost:8080";

const router = useRouter();
const recommendedQuests = ref([]);
const loading = ref(false);

const fetchRecommendedQuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/quests/recommendation?limit=5`);
        recommendedQuests.value = response.data;
    } catch (error) {
        console.error("추천 퀘스트 조회 실패", error);
    }
};

const handleStartClick = (questId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
    }

    loading.value = true;

    axios
        .patch(
            `${API_URL}/quests/${questId}/start`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((response) => {
            alert(response.data.message || "해당 퀘스트가 시작되었습니다.");
            fetchRecommendedQuests();
            // 상세 페이지로 이동하려면 아래 주석 해제
            // router.push(`/quests/${questId}`);
        })
        .catch((error) => {
            let errorMessage = "퀘스트 시작 중 오류가 발생했습니다.";
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
                } else if (error.response.status === 403) {
                    errorMessage = "퀘스트 시작 권한이 없습니다.";
                } else if (error.response.status === 404) {
                    errorMessage = "해당 퀘스트를 찾을 수 없습니다.";
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
            }
            alert(errorMessage);
        })
        .finally(() => {
            loading.value = false;
        });
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
