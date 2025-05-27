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
                    <div class="card-image">
                        <!-- <img :src="quest.img" alt="관광지 이미지" class="thumbnail" /> -->

                        <template v-if="quest.img && quest.img !== 'null'">
                            <img :src="quest.img" alt="관광지 이미지" class="thumbnail" />
                        </template>
                        <template v-else>
                            <img src="@/assets/images/no_attraction_image_available.png" alt="" class="thumbnail" />
                        </template>

                        <div class="difficulty-badge" :class="getDifficultyClass(quest.difficulty)">
                            {{ quest.difficulty }}
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="quest-header">
                            <h3 class="quest-title">{{ quest.title }}</h3>
                            <div class="quest-meta">
                                <div class="meta-item">
                                    <span class="meta-icon">📅</span>
                                    <span>{{ formatDate(quest.createdAt) }}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-icon">👥</span>
                                    <span>{{ quest.participantCount }}명</span>
                                </div>
                            </div>
                        </div>

                        <div class="reward-section">
                            <div class="reward-item exp">
                                <span class="reward-icon">⭐</span>
                                <span class="reward-text">EXP +{{ quest.exp }}</span>
                            </div>
                            <div class="reward-item stamp">
                                <span class="reward-icon">🏆</span>
                                <span class="reward-text">스탬프</span>
                            </div>
                        </div>
                    </div>

                    <button @click="handleStartClick(quest.questId)" :disabled="loading" class="start-btn">
                        <span class="btn-icon">🎯</span>
                        {{ loading ? "시작 중..." : "퀘스트 시작" }}
                    </button>
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

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
    });
};

const getDifficultyClass = (difficulty) => {
    const difficultyMap = {
        EASY: "easy",
        MEDIUM: "normal",
        HARD: "hard",
        VERY_HARD: "very-hard",
    };
    return difficultyMap[difficulty] || "normal";
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
    margin-bottom: 2rem;
    padding: 0 0.2rem;
}

/* 카드 스타일 */
.card {
    width: 125%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 1rem;
    border: 0.0625rem solid #e3e8ef;
    box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.08), 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    max-height: 25rem;
    margin: 0 0.25rem;
}

.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
    border-radius: 1rem 1rem 0 0;
}

.card:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.12), 0 0.25rem 0.75rem rgba(0, 0, 0, 0.06);
}

/* 카드 이미지 영역 */
.card-image {
    position: relative;
    overflow: hidden;
}

.thumbnail {
    width: 100%;
    height: 9rem;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.card:hover .thumbnail {
    transform: scale(1.05);
}

.difficulty-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    backdrop-filter: blur(0.625rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.2);
}

.difficulty-badge.easy {
    background: #28a745;
    color: white;
}

.difficulty-badge.normal {
    background: #fd7e14;
    color: white;
}

.difficulty-badge.hard {
    background: #dc3545;
    color: white;
}

.difficulty-badge.very-hard {
    background: rgba(165, 55, 253, 0.9);
    color: white;
}

/* 카드 컨텐츠 */
.card-content {
    flex: 1;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.quest-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.quest-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.quest-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #546e7a;
    background: #eceff1;
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
}

.meta-icon {
    font-size: 0.875rem;
}

/* 보상 섹션 */
.reward-section {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
}

.reward-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    flex: 1;
    justify-content: center;
}

.reward-item.exp {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    color: #f57c00;
    border: 0.0625rem solid #ffcc02;
}

.reward-item.stamp {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    color: #388e3c;
    border: 0.0625rem solid #4caf50;
}

.reward-icon {
    font-size: 1rem;
}

.reward-text {
    font-size: 0.75rem;
}

/* 시작 버튼 */
.start-btn {
    margin: 0 1.25rem 1.25rem 1.25rem;
    background: linear-gradient(135deg, #7db4d5 0%, #5da0c4 100%);
    color: white;
    border: none;
    padding: 0.875rem 1.25rem;
    border-radius: 0.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 0.25rem 0.75rem rgba(255, 107, 107, 0.3);
    position: relative;
    overflow: hidden;
}

.start-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.start-btn:hover::before {
    left: 100%;
}

.start-btn:hover:not(:disabled) {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.375rem 1.25rem rgba(255, 107, 107, 0.4);
    background: linear-gradient(135deg, #feca57 0%, #48dbfb 100%);
}

.start-btn:active:not(:disabled) {
    transform: translateY(0);
}

.start-btn:disabled {
    background: linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.btn-icon {
    font-size: 1rem;
}

/* Swiper 스타일 */
::v-deep(.swiper-horizontal) {
    padding: 0 0.5rem;
}

::v-deep(.swiper-wrapper) {
    padding: 1rem 0 1.5rem 0;
}

::v-deep(.swiper-slide) {
    padding: 0 0.25rem;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
    .card {
        min-height: 19rem;
        margin: 0 0.125rem;
    }

    .thumbnail {
        height: 7.5rem;
    }

    .card-content {
        padding: 1rem;
    }

    .quest-title {
        font-size: 1rem;
    }

    .start-btn {
        margin: 0 1rem 1rem 1rem;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
    }

    ::v-deep(.swiper-slide) {
        padding: 0 0.125rem;
    }
}

@media (min-width: 1024px) {
    .card:hover {
        transform: translateY(-0.375rem) scale(1.02);
    }
}

/* 로딩 애니메이션 */
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.start-btn:disabled .btn-icon {
    animation: pulse 1.5s infinite;
}
</style>
