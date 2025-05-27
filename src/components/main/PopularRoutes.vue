<template>
    <section class="section popular-routes">
        <BasicTitle msg="🗺️ 인기 여행 루트" color="black" />
        <Swiper
            :slides-per-view="1"
            :space-between="16"
            :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 35 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
                1280: { slidesPerView: 4, spaceBetween: 45 },
            }"
        >
            <SwiperSlide v-for="plan in planList" :key="plan.planId">
                <div class="card">
                    <div class="card-content">
                        <div class="plan-header-info">
                            <h3 class="plan-title">{{ plan.planTitle }}</h3>
                            <div class="plan-dates">
                                <span class="date-badge">{{ formatDateRange(plan.startDate, plan.endDate) }}</span>
                                <div class="duration-info">
                                    <span class="meta-icon">📍</span>
                                    <span class="duration-badge">{{ plan.duration }}일</span>
                                </div>
                            </div>
                        </div>

                        <div class="plan-meta">
                            <div class="meta-item">
                                <span class="meta-icon">📝</span>
                                <span>{{ plan.routesCnt }}곳</span>
                            </div>
                        </div>

                        <div v-if="plan.planDescription" class="plan-description">
                            {{ truncateText(plan.planDescription, 80) }}
                        </div>

                        <!-- 진행률 -->
                        <div class="progress-section">
                            <div class="progress-label">계획 진행률</div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: `${plan.completionRate}%` }"></div>
                            </div>
                            <div class="progress-text">{{ plan.completionRate }}%</div>
                        </div>
                    </div>

                    <button @click="handleStartClick(plan.planId)" :disabled="loading" class="start-btn">
                        <span class="btn-icon">🚀</span>
                        {{ loading ? "저장 중..." : "시작하기" }}
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
const planList = ref([]);
const loading = ref(false);

const fetchRecommendedQuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/plans/mainPage`);
        planList.value = response.data;
        console.log(planList.value);
    } catch (error) {
        console.error("추천 여행 경로 조회 실패", error);
    }
};

const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    const end = new Date(endDate).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    return `${start} ~ ${end}`;
};

const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
};

const handleStartClick = (planId) => {
    console.log(planId);
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
    }

    loading.value = true;

    axios
        .post(
            `${API_URL}/plans/${planId}/copy`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((response) => {
            alert(response.data.message || "해당 여행 경로를 저장하였습니다.");
            fetchRecommendedQuests();
        })
        .catch((error) => {
            let errorMessage = "여행 경로 저장 중 오류가 발생했습니다.";
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
                } else if (error.response.status === 403) {
                    errorMessage = "여행 경로 저장 권한이 없습니다.";
                } else if (error.response.status === 404) {
                    errorMessage = "해당 여행 경로를 찾을 수 없습니다.";
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
    margin-bottom: 32px;
    padding: 0 8px;
}

/* 카드 스타일 */
.card {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #e3e8ef;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    min-height: 320px;
}

.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7db4d5 0%, #5da0c4 50%, #4a90e2 100%);
    border-radius: 16px 16px 0 0;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* 카드 컨텐츠 */
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* 헤더 정보 */
.plan-header-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.plan-title {
    font-size: 18px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.plan-dates {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.date-badge {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    color: #4a90e2;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid #90caf9;
    width: fit-content;
}

.duration-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.duration-badge {
    font-size: 13px;
    font-weight: 600;
    color: #7b1fa2;
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    padding: 4px 10px;
    border-radius: 16px;
    border: 1px solid #ce93d8;
}

/* 메타 정보 */
.plan-meta {
    display: flex;
    gap: 16px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #546e7a;
    background: #eceff1;
    padding: 6px 12px;
    border-radius: 12px;
}

.meta-icon {
    font-size: 16px;
}

/* 설명 */
.plan-description {
    font-size: 14px;
    color: #546e7a;
    line-height: 1.5;
    background: #f8f9fa;
    padding: 12px;
    border-radius: 12px;
    border-left: 3px solid #7db4d5;
}

/* 진행률 섹션 */
.progress-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
    padding-top: 16px;
}

.progress-label {
    font-size: 13px;
    font-weight: 600;
    color: #37474f;
    display: flex;
    align-items: center;
    gap: 6px;
}

.progress-label::before {
    content: "📊";
    font-size: 14px;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #e8eaf6;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7db4d5 0%, #5da0c4 50%, #4a90e2 100%);
    border-radius: 6px;
    transition: width 0.6s ease;
    position: relative;
    overflow: hidden;
}

.progress-fill::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}

.progress-text {
    font-size: 12px;
    font-weight: 600;
    color: #4a90e2;
    text-align: right;
    margin-top: 4px;
}

/* 시작하기 버튼 */
.start-btn {
    margin-top: 20px;
    background: linear-gradient(135deg, #7db4d5 0%, #5da0c4 100%);
    color: white;
    border: none;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(125, 180, 213, 0.3);
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
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(125, 180, 213, 0.4);
    background: linear-gradient(135deg, #5da0c4 0%, #4a90e2 100%);
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
    font-size: 16px;
}

/* Swiper 스타일 */
::v-deep(.swiper-horizontal) {
    padding: 0 16px;
}

::v-deep(.swiper-wrapper) {
    padding: 16px 0 24px 0;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
    .card {
        padding: 16px;
        min-height: 280px;
    }

    .plan-title {
        font-size: 16px;
    }

    .start-btn {
        padding: 12px 16px;
        font-size: 14px;
    }
}

@media (min-width: 1024px) {
    .card:hover {
        transform: translateY(-6px) scale(1.02);
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
