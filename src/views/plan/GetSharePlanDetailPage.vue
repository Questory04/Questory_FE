<template>
    <div class="travel-plan-detail-container">
        <h1 class="main-title">여행 계획 상세</h1>
        <div class="title-underline"></div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>여행 계획을 불러오는 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="error-container">
            <div class="error-icon">⚠️</div>
            <h3>계획을 불러올 수 없습니다</h3>
            <p>{{ error }}</p>
            <button @click="loadPlanDetail" class="retry-btn">다시 시도</button>
        </div>

        <!-- 메인 컨텐츠 -->
        <div v-else class="content-wrapper">
            <!-- 좌측 지도 및 일정 영역 -->
            <div class="map-section">
                <!-- 계획 정보 헤더 -->
                <div class="plan-header-card">
                    <div class="plan-info">
                        <h2 class="plan-title">{{ planDetail.title || "여행 계획" }}</h2>
                        <div class="plan-meta">
                            <span class="plan-duration">
                                <i class="icon">📅</i>
                                {{ getTripDuration() }}일 여행
                            </span>
                            <span class="plan-date">
                                <i class="icon">🗓️</i>
                                {{ formatDate(planDetail.startDate) }} ~ {{ formatDate(planDetail.endDate) }}
                            </span>
                        </div>
                        <p v-if="planDetail.description" class="plan-description">
                            {{ planDetail.description }}
                        </p>
                    </div>
                </div>

                <!-- 카카오 지도 -->
                <div class="map-container">
                    <KakaoMap :lat="mapCenter.lat" :lng="mapCenter.lng" :draggable="true" width="100%" height="500px">
                        <!-- 일정별 마커들 -->
                        <KakaoMapMarker
                            v-for="(place, index) in allPlaces"
                            :key="`marker_${place.day}_${index}`"
                            :lat="place.latitude"
                            :lng="place.longitude"
                            :clickable="true"
                            @onClickKakaoMapMarker="selectPlace(place)"
                        >
                        </KakaoMapMarker>
                    </KakaoMap>
                </div>

                <!-- 지도 컨트롤 버튼들 -->
                <div class="map-controls">
                    <button @click="getCurrentLocation" class="control-btn">
                        <i class="icon">📍</i>
                        현재 위치
                    </button>
                </div>

                <!-- 하단 버튼 -->
                <div class="bottom-buttons">
                    <button @click="goBack" class="back-btn">목록으로</button>
                    <button @click="savePlan" class="export-btn">저장하기</button>
                </div>
            </div>

            <!-- 우측 사이드바 -->
            <div class="sidebar">
                <!-- 선택된 장소 정보 카드 -->
                <div class="place-info-card">
                    <div class="card-header">
                        <h3>{{ selectedPlace ? selectedPlace.name : "장소 정보" }}</h3>
                        <span v-if="selectedPlace" class="place-type-badge">
                            DAY{{ selectedPlace.day }} - {{ selectedPlace.type }}
                        </span>
                    </div>
                    <div class="card-body">
                        <div v-if="selectedPlace">
                            <p class="place-address">
                                <i class="icon">📍</i>
                                {{ selectedPlace.address }}
                            </p>
                            <p v-if="selectedPlace.phone" class="place-phone">
                                <i class="icon">📞</i>
                                {{ selectedPlace.phone }}
                            </p>
                            <p v-if="selectedPlace.categoryName" class="place-category">
                                <i class="icon">🏷️</i>
                                {{ selectedPlace.categoryName }}
                            </p>
                            <div class="place-actions">
                                <button @click="openInKakaoMap" class="kakao-btn">
                                    <i class="icon">🔗</i>
                                    카카오맵에서 보기
                                </button>
                            </div>
                        </div>
                        <div v-else class="no-selection">
                            <p>지도에서 장소를 선택해주세요</p>
                        </div>
                    </div>
                </div>

                <!-- DAY 탭들 -->
                <div class="day-tabs">
                    <button
                        v-for="day in days"
                        :key="day"
                        :class="['day-tab', { active: activeDay === day }]"
                        @click="setActiveDay(day)"
                    >
                        DAY{{ day }}
                        <span class="day-count">({{ getDayPlacesCount(day) }})</span>
                    </button>
                </div>

                <!-- 일정 상세 보기 -->
                <div class="day-schedule-container">
                    <div class="schedule-header">
                        <h4>DAY{{ activeDay }} 일정</h4>
                        <span class="schedule-date">
                            {{ getScheduleDate(activeDay) }}
                        </span>
                    </div>

                    <div class="schedule-timeline">
                        <div
                            v-for="(place, index) in getCurrentDayPlaces()"
                            :key="`schedule_${place.day}_${index}`"
                            :class="['timeline-item', { active: selectedPlace?.attractionId === place.attractionId }]"
                            @click="selectPlace(place)"
                        >
                            <div class="timeline-marker">
                                <span class="sequence-number">{{ place.sequence }}</span>
                            </div>
                            <div class="timeline-content">
                                <div class="place-main-info">
                                    <h5 class="place-name">{{ place.name }}</h5>
                                    <span class="place-type">{{ place.type }}</span>
                                </div>
                                <p class="place-address-short">
                                    <i class="icon">📍</i>
                                    {{ place.address }}
                                </p>
                                <div v-if="place.categoryName" class="place-category-short">
                                    <i class="icon">🏷️</i>
                                    {{ place.categoryName }}
                                </div>
                            </div>
                        </div>

                        <!-- 빈 일정 -->
                        <div v-if="getCurrentDayPlaces().length === 0" class="empty-schedule">
                            <div class="empty-icon">📝</div>
                            <p>이 날의 일정이 없습니다</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import axios from "axios";

import { useAuthStore } from "@/stores/auth";
// 인증 스토어 가져오기
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

// 반응형 데이터
const loading = ref(true);
const error = ref(null);
const planDetail = ref({});
const routes = ref([]);
const selectedPlace = ref(null);
const activeDay = ref(1);

const mapCenter = reactive({
    lat: 35.1595454, // 광주 중심 좌표
    lng: 126.8526012,
});

const days = computed(() => {
    console.log("days computed - totalDays:", planDetail.value.totalDays);
    console.log("routes.value:", routes.value);

    // routes 데이터에서 최대 day 값 찾기
    if (Array.isArray(routes.value) && routes.value.length > 0) {
        const maxDay = Math.max(...routes.value.map((route) => parseInt(route.day) || 1));
        console.log("routes에서 찾은 최대 day:", maxDay);

        if (planDetail.value.totalDays) {
            const planTotalDays = parseInt(planDetail.value.totalDays);
            const actualDays = Math.max(maxDay, planTotalDays);
            console.log("최종 결정된 총 일수:", actualDays);
            return Array.from({ length: actualDays }, (_, i) => i + 1);
        } else {
            return Array.from({ length: maxDay }, (_, i) => i + 1);
        }
    }

    // 기본값
    const defaultDays = planDetail.value.totalDays ? parseInt(planDetail.value.totalDays) : 1;
    return Array.from({ length: defaultDays }, (_, i) => i + 1);
});

const allPlaces = computed(() => {
    if (!Array.isArray(routes.value)) {
        console.warn("routes.value is not an array:", routes.value);
        return [];
    }
    return routes.value.filter((route) => route.latitude && route.longitude);
});

// 메서드들
const loadPlanDetail = async () => {
    loading.value = true;
    error.value = null;

    try {
        const planId = route.params.planId;

        const token = localStorage.getItem("accessToken");

        if (!token) {
            throw new Error("로그인이 필요합니다.");
        }

        // 계획 상세 정보 로드
        const planResponse = await axios.get(`http://localhost:8080/plans/${planId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        planDetail.value = planResponse.data;
        console.log("planResponse");
        console.log(planResponse.data);

        // 라우트 정보 로드 - 백엔드 API 구조에 맞게 수정
        const routesResponse = await axios.get(`http://localhost:8080/routes/${planId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // 백엔드에서 { routes: [...] } 형태로 반환하므로 routes 배열 추출
        const routesData = routesResponse.data;
        if (routesData && Array.isArray(routesData.routes)) {
            routes.value = routesData.routes;
        } else if (Array.isArray(routesData)) {
            // 만약 직접 배열로 반환된다면
            routes.value = routesData;
        } else {
            console.warn("Routes data is not in expected format:", routesData);
            routes.value = [];
        }

        // 지도 중심점을 첫 번째 장소로 설정
        if (allPlaces.value.length > 0) {
            const firstPlace = allPlaces.value[0];
            mapCenter.lat = firstPlace.latitude;
            mapCenter.lng = firstPlace.longitude;
        }

        console.log("여행 계획 상세 정보 로드 완료:", planDetail.value);
        console.log("라우트 정보:", routes.value);

        // 성공적으로 데이터 로드 후
        console.log("데이터 로드 완료 후 상태 확인:");
        console.log("planDetail.value:", planDetail.value);
        console.log("routes.value:", routes.value);

        // 첫 번째 DAY로 설정 (명시적으로)
        if (Array.isArray(routes.value) && routes.value.length > 0) {
            const availableDays = [...new Set(routes.value.map((route) => parseInt(route.day)))].sort();
            console.log("사용 가능한 DAY들:", availableDays);
            activeDay.value = availableDays[0] || 1;
        } else {
            activeDay.value = 1;
        }

        console.log("초기 activeDay 설정:", activeDay.value);
    } catch (err) {
        console.error("계획 로드 중 오류:", err);
        if (err.response?.status === 401) {
            error.value = "로그인이 만료되었습니다. 다시 로그인해주세요.";
            // 로그인 페이지로 리다이렉트
            setTimeout(() => router.push("/login"), 2000);
        } else {
            error.value = err.response?.data?.message || "계획을 불러오는 중 오류가 발생했습니다.";
        }
    } finally {
        loading.value = false;
    }
};

const getCurrentDayPlaces = () => {
    if (!Array.isArray(routes.value)) {
        console.warn("routes.value is not an array:", routes.value);
        return [];
    }

    const currentDay = parseInt(activeDay.value);
    const filtered = routes.value.filter((route) => {
        const routeDay = parseInt(route.day);
        return routeDay === currentDay;
    });

    return filtered.sort((a, b) => parseInt(a.sequence) - parseInt(b.sequence));
};

const getDayPlacesCount = (day) => {
    if (!Array.isArray(routes.value)) {
        return 0;
    }
    const targetDay = parseInt(day);
    return routes.value.filter((route) => parseInt(route.day) === targetDay).length;
};

const getScheduleDate = (day) => {
    if (!planDetail.value.startDate) return "";

    const startDate = new Date(planDetail.value.startDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + day - 1);

    return targetDate.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        weekday: "short",
    });
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
};

const setActiveDay = (day) => {
    console.log("DAY 탭 클릭:", day);
    activeDay.value = parseInt(day); // 명시적으로 숫자로 변환
    console.log("변경된 activeDay:", activeDay.value);
};

const selectPlace = (place) => {
    selectedPlace.value = place;

    // 지도 중심을 선택된 장소로 이동
    if (place.latitude && place.longitude) {
        mapCenter.lat = place.latitude;
        mapCenter.lng = place.longitude;
    }

    console.log("선택된 장소:", place);
};

const getCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                mapCenter.lat = position.coords.latitude;
                mapCenter.lng = position.coords.longitude;
                console.log("현재 위치로 이동:", mapCenter);
            },
            (error) => {
                console.error("위치 정보를 가져올 수 없습니다:", error);
                alert("위치 정보를 가져올 수 없습니다.");
            }
        );
    } else {
        alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
    }
};

const getTripDuration = () => {
    return calculateTripDays(planDetail.value.startDate, planDetail.value.endDate);
};

const calculateTripDays = (startDate, endDate) => {
    if (!startDate || !endDate) {
        console.log("시작일 또는 종료일이 없습니다:", { startDate, endDate });
        return 1; // 기본값
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // 날짜가 유효한지 확인
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error("유효하지 않은 날짜:", { startDate, endDate });
            return 1;
        }

        // 시간 차이를 밀리초로 계산
        const timeDifference = end.getTime() - start.getTime();

        // 밀리초를 일수로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // 당일 여행인 경우 1일로 처리, 그 외에는 +1 (포함적 계산)
        const totalDays = daysDifference === 0 ? 1 : daysDifference + 1;

        console.log("날짜 계산 결과:", {
            startDate,
            endDate,
            start: start.toLocaleDateString(),
            end: end.toLocaleDateString(),
            daysDifference,
            totalDays,
        });

        return totalDays;
    } catch (error) {
        console.error("날짜 계산 중 오류:", error);
        return 1;
    }
};

const openInKakaoMap = () => {
    if (!selectedPlace.value) return;

    const { latitude, longitude, name } = selectedPlace.value;
    const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`;
    window.open(kakaoMapUrl, "_blank");
};

const savePlan = async () => {
    try {
        // 로딩 상태 표시
        const saveButton = document.querySelector(".export-btn");
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = "저장 중...";
        }

        const token = authStore.accessToken;

        if (!token) {
            this.error = "로그인이 필요합니다.";
            this.loading = false;
            return;
        }

        // 현재 계획 ID 가져오기
        const planId = route.params.planId;

        if (!planId) {
            throw new Error("계획 ID를 찾을 수 없습니다.");
        }

        // 계획 복사 API 호출
        const response = await axios.post(
            `http://localhost:8080/plans/${planId}/copy`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("계획 복사 성공:", response.data);

        // 성공 알림
        alert("여행 계획이 성공적으로 복사되었습니다!");

        // 복사된 계획의 ID가 응답에 포함되어 있다면 해당 계획으로 이동
        if (response.data && response.data.planId) {
            const copiedPlanId = response.data.planId;
            router.push(`/plans/${copiedPlanId}`);
        } else {
            // 계획 목록 페이지로 이동
            router.push("/plans/all");
        }
    } catch (err) {
        console.error("계획 복사 중 오류:", err);

        // 에러 메시지 처리
        let errorMessage = "계획을 복사하는 중 오류가 발생했습니다.";

        if (err.response?.status === 401) {
            errorMessage = "로그인이 만료되었습니다. 다시 로그인해주세요.";
            setTimeout(() => router.push("/login"), 2000);
        } else if (err.response?.status === 404) {
            errorMessage = "계획을 찾을 수 없습니다.";
        } else if (err.response?.status === 403) {
            errorMessage = "계획을 복사할 권한이 없습니다.";
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }

        alert(errorMessage);
    } finally {
        // 로딩 상태 해제
        const saveButton = document.querySelector(".export-btn");
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = "저장하기";
        }
    }
};

// const exportPlan = () => {
//     // 계획 내보내기 기능 (JSON 형태로 다운로드)
//     const exportData = {
//         plan: planDetail.value,
//         routes: routes.value,
//     };

//     const dataStr = JSON.stringify(exportData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(dataBlob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${planDetail.value.title || "여행계획"}_${new Date().toISOString().split("T")[0]}.json`;
//     link.click();

//     URL.revokeObjectURL(url);
// };

const goBack = () => {
    router.push("/plans/all");
};

// 컴포넌트 마운트 시
onMounted(() => {
    loadPlanDetail();
    console.log("여행 계획 상세 페이지 로드됨");
});
</script>

<style scoped>
.travel-plan-detail-container {
    width: 100%;
    max-width: 87.5rem;
    margin: 0 auto;
    padding: 1.25rem;
    background-color: #ffffff;
    font-family: "Noto Sans KR", sans-serif;
}

/* 제목 스타일 */
.main-title {
    text-align: center;
    color: #5a9bd8;
    font-size: 2rem;
    font-weight: bold;
    margin: 1.25rem 0 0.625rem 0;
}

.title-underline {
    width: 12.5rem;
    height: 0.25rem;
    background-color: #5a9bd8;
    margin: 0 auto 1.875rem auto;
}

/* 로딩 및 에러 상태 */
.loading-container,
.error-container {
    text-align: center;
    padding: 3rem 1.25rem;
    color: #6c757d;
}

.spinner {
    border: 0.188rem solid #f3f3f3;
    border-top: 0.188rem solid #007bff;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.error-container .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.retry-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
}

.retry-btn:hover {
    background-color: #0056b3;
}

/* 메인 컨텐츠 래퍼 */
.content-wrapper {
    display: flex;
    gap: 1.25rem;
    height: 100%;
}

/* 좌측 지도 섹션 */
.map-section {
    flex: 3;
    display: flex;
    flex-direction: column;
}

/* 계획 헤더 카드 */
.plan-header-card {
    background-color: #f8f9fa;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    border: 0.063rem solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.plan-info {
    flex: 1;
}

.plan-title {
    margin: 0 0 0.75rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 700;
}

.plan-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
}

.plan-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #6c757d;
    font-size: 0.9rem;
}

.plan-description {
    color: #495057;
    line-height: 1.5;
    margin: 0;
}

.plan-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* 지도 컨테이너 */
.map-container {
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
    height: 31.25rem;
    width: 100%;
}

/* 지도 컨트롤 */
.map-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    justify-content: center;
}

.control-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    border: 0.063rem solid #dee2e6;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
}

.control-btn:hover {
    background-color: #e9ecef;
    transform: translateY(-0.063rem);
}

/* 하단 버튼 */
.bottom-buttons {
    display: flex;
    gap: 1.25rem;
    justify-content: center;
    margin-top: 1rem;
}

.back-btn,
.export-btn {
    width: 10rem;
    height: 3.125rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn {
    background-color: #6c757d;
    color: white;
}

.back-btn:hover {
    background-color: #5a6268;
}

.export-btn {
    background-color: #17a2b8;
    color: white;
}

.export-btn:hover {
    background-color: #138496;
}

/* 우측 사이드바 */
.sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 18.75rem;
}

/* 장소 정보 카드 */
.place-info-card {
    background-color: #f8f9fa;
    border-radius: 0.75rem;
    padding: 1.25rem;
    border: 0.063rem solid #e9ecef;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.card-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
}

.place-type-badge {
    background-color: #78b5f3;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 500;
}

.card-body {
    color: #666;
}

.place-address,
.place-phone,
.place-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 0.9rem;
}

.place-actions {
    margin-top: 1rem;
}

.kakao-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: #fee500;
    color: #3c1e1e;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.kakao-btn:hover {
    background-color: #fdd700;
}

.no-selection {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 2rem 1rem;
}

/* DAY 탭들 */
.day-tabs {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
}

.day-tab {
    flex: 1;
    min-width: calc(25% - 0.281rem);
    padding: 0.625rem 0.75rem;
    background-color: #f5f5f5;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
}

.day-tab.active {
    background-color: #4a90e2;
    color: white;
    transform: translateY(-0.063rem);
}

.day-tab:hover:not(.active) {
    background-color: #e8e8e8;
}

.day-count {
    font-size: 0.75rem;
    opacity: 0.8;
}

/* 일정 상세 컨테이너 */
.day-schedule-container {
    flex: 1;
    background-color: white;
    border: 0.063rem solid #dee2e6;
    border-radius: 0.5rem;
    overflow: hidden;
    max-height: 30rem;
}

.schedule-header {
    background-color: #f8f9fa;
    padding: 1rem;
    border-bottom: 0.063rem solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.schedule-header h4 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
}

.schedule-date {
    color: #6c757d;
    font-size: 0.85rem;
}

/* 타임라인 스타일 */
.schedule-timeline {
    padding: 1rem;
    max-height: 25rem;
    overflow-y: auto;
}

.timeline-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 0.75rem;
    border: 0.063rem solid #e9ecef;
    position: relative;
}

.timeline-item:hover {
    background-color: #f8f9fa;
    transform: translateX(0.25rem);
}

.timeline-item.active {
    background-color: #e3f2fd;
    border-color: #2196f3;
    box-shadow: 0 0.125rem 0.5rem rgba(33, 150, 243, 0.2);
}

.timeline-marker {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    background-color: #4a90e2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
}

.timeline-item.active .timeline-marker {
    background-color: #2196f3;
    transform: scale(1.1);
}

.timeline-content {
    flex: 1;
}

.place-main-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
}

.place-name {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
}

.place-type {
    background-color: #e3f2fd;
    color: #1976d2;
    padding: 0.125rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
}

.place-address-short,
.place-category-short {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: #6c757d;
}

.place-address-short {
    color: #495057;
    font-weight: 500;
}

/* 빈 일정 */
.empty-schedule {
    text-align: center;
    padding: 3rem 1rem;
    color: #6c757d;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

/* 스크롤바 스타일 */
.schedule-timeline::-webkit-scrollbar {
    width: 0.375rem;
}

.schedule-timeline::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 0.188rem;
}

.schedule-timeline::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

/* 반응형 디자인 */
/* 태블릿 (768px ~ 1024px) */
@media (max-width: 64rem) and (min-width: 48rem) {
    .travel-plan-detail-container {
        padding: 1rem;
    }

    .main-title {
        font-size: 1.75rem;
    }

    .content-wrapper {
        gap: 1rem;
    }

    .plan-header-card {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .plan-actions {
        justify-content: flex-end;
    }

    .map-container {
        height: 25rem;
    }

    .sidebar {
        min-width: 15rem;
    }

    .day-tab {
        min-width: calc(33.333% - 0.25rem);
    }

    .stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
    }
}

/* 모바일 (최대 768px) */
@media (max-width: 48rem) {
    .travel-plan-detail-container {
        padding: 0.75rem;
        max-width: 100%;
    }

    .main-title {
        font-size: 1.5rem;
        margin: 1rem 0 0.5rem 0;
    }

    .title-underline {
        width: 10rem;
        height: 0.1875rem;
        margin-bottom: 1.25rem;
    }

    .content-wrapper {
        flex-direction: column;
        gap: 1rem;
    }

    .map-section {
        order: 2;
    }

    .sidebar {
        order: 1;
        min-width: auto;
    }

    /* 계획 헤더 */
    .plan-header-card {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .plan-title {
        font-size: 1.25rem;
    }

    .plan-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .plan-actions {
        justify-content: stretch;
        gap: 0.5rem;
    }

    .edit-btn,
    .share-btn,
    .delete-btn {
        flex: 1;
        justify-content: center;
        padding: 0.75rem 0.5rem;
        font-size: 0.85rem;
    }

    /* 지도 */
    .map-container {
        height: 18.75rem;
        margin-bottom: 1rem;
    }

    .map-controls {
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-btn {
        width: 100%;
        justify-content: center;
        padding: 0.75rem;
    }

    /* 하단 버튼 */
    .bottom-buttons {
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }

    .back-btn,
    .export-btn {
        width: 100%;
        height: 2.75rem;
        font-size: 1rem;
    }

    /* 사이드바 */
    .sidebar {
        gap: 0.875rem;
    }

    .place-info-card {
        padding: 1rem;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.875rem;
    }

    .card-header h3 {
        font-size: 1.1rem;
    }

    .place-type-badge {
        align-self: flex-start;
    }

    /* DAY 탭 */
    .day-tabs {
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .day-tab {
        flex: 1;
        min-width: calc(50% - 0.125rem);
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
    }

    /* 일정 상세 */
    .schedule-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }

    .schedule-timeline {
        max-height: 15rem;
        padding: 0.75rem;
    }

    .timeline-item {
        padding: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .timeline-marker {
        width: 2rem;
        height: 2rem;
        font-size: 0.8rem;
    }

    .place-main-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.375rem;
    }

    .place-name {
        font-size: 1rem;
    }

    .place-type {
        align-self: flex-start;
    }

    .place-address-short,
    .place-category-short {
        font-size: 0.8rem;
    }

    .empty-schedule {
        padding: 2rem 1rem;
    }

    .empty-icon {
        font-size: 2.5rem;
    }
}

/* 작은 모바일 (최대 480px) */
@media (max-width: 30rem) {
    .travel-plan-detail-container {
        padding: 0.5rem;
    }

    .main-title {
        font-size: 1.25rem;
    }

    .title-underline {
        width: 8rem;
    }

    .plan-header-card {
        padding: 0.75rem;
    }

    .plan-title {
        font-size: 1.125rem;
    }

    .edit-btn,
    .share-btn,
    .delete-btn {
        padding: 0.625rem 0.5rem;
        font-size: 0.8rem;
    }

    .map-container {
        height: 15rem;
    }

    .day-tabs {
        flex-direction: column;
    }

    .day-tab {
        min-width: auto;
        width: 100%;
        margin-bottom: 0.25rem;
    }

    .schedule-timeline {
        max-height: 12rem;
        padding: 0.5rem;
    }

    .timeline-item {
        padding: 0.625rem;
    }

    .timeline-marker {
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.75rem;
    }

    .place-name {
        font-size: 0.95rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .stat-item {
        padding: 0.75rem;
    }
}

/* 가로 모드 모바일 */
@media (max-width: 48rem) and (orientation: landscape) {
    .map-container {
        height: 12.5rem;
    }

    .schedule-timeline {
        max-height: 10rem;
    }

    .content-wrapper {
        gap: 0.75rem;
    }
}

/* 고해상도 디스플레이 최적화 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .plan-header-card,
    .place-info-card,
    .timeline-item,
    .day-schedule-container {
        border-width: 0.031rem;
    }

    .schedule-header {
        border-bottom-width: 0.031rem;
    }

    .spinner {
        border-width: 0.094rem;
        border-top-width: 0.094rem;
    }
}
</style>
