<template>
    <div class="travel-planner-container">
        <h1 class="main-title">여행 계획 생성</h1>
        <div class="title-underline"></div>

        <div class="content-wrapper">
            <!-- 좌측 지도 및 검색 영역 -->
            <div class="map-section">
                <!-- 검색바 -->
                <div class="search-container">
                    <div class="search-bar">
                        <input
                            type="text"
                            v-model="searchQuery"
                            placeholder="예: 광주 조각, 부산 카페, 제주 맛집..."
                            class="search-input"
                            @keyup.enter="searchAttractions"
                        />
                        <button @click="searchAttractions" class="search-btn" :disabled="isSearching">
                            🔍 {{ isSearching ? "검색중..." : "검색" }}
                        </button>
                    </div>
                    <button @click="getCurrentLocation" class="location-btn">📍 현재 위치</button>
                </div>

                <!-- 카테고리 검색 버튼들 -->
                <div class="category-buttons">
                    <button @click="searchByCategory('FD6', '맛집')" class="category-btn food">🍽️ 맛집</button>
                    <button @click="searchByCategory('CE7', '카페')" class="category-btn cafe">☕ 카페</button>
                    <button @click="searchByCategory('AT4', '관광명소')" class="category-btn tourist">🏛️ 관광지</button>
                    <button @click="searchByCategory('AD5', '숙박')" class="category-btn hotel">🏨 숙박</button>
                    <button @click="clearMapResults" class="category-btn clear">🗑️ 지도 검색결과 지우기</button>
                </div>

                <!-- 카카오 지도 -->
                <div class="map-container">
                    <KakaoMap
                        :lat="mapCenter.lat"
                        :lng="mapCenter.lng"
                        :draggable="true"
                        width="100%"
                        height="500px"
                        @onCenterChanged="onMapCenterChanged"
                    >
                        <!-- 지도 마커들 -->
                        <KakaoMapMarker
                            v-for="attraction in attractions"
                            :key="attraction.id"
                            :lat="attraction.lat"
                            :lng="attraction.lng"
                            :clickable="true"
                            @onClickKakaoMapMarker="selectAttraction(attraction)"
                        >
                        </KakaoMapMarker>
                    </KakaoMap>
                </div>

                <!-- 검색 결과 리스트 -->
                <div v-if="searchResults.length > 0 || isSearching" class="search-results">
                    <div class="search-results-header">
                        <h3>
                            🔍 검색 결과
                            <span v-if="!isSearching">({{ searchResults.length }}개)</span>
                            <span v-if="isSearching" class="loading">검색 중...</span>
                        </h3>
                        <div class="search-actions">
                            <button @click="addAllSearchResultsToMap" class="btn-add-all" :disabled="isSearching">
                                📍 모든 결과를 지도에 추가
                            </button>
                            <button @click="clearSearchResults" class="btn-clear-search" :disabled="isSearching">
                                ❌ 검색 결과 지우기
                            </button>
                        </div>
                    </div>

                    <div class="search-results-list">
                        <!-- 로딩 상태 -->
                        <div v-if="isSearching" class="loading-spinner">
                            <div class="spinner"></div>
                            <p>장소를 검색하고 있습니다...</p>
                        </div>

                        <!-- 검색 결과 카드들 -->
                        <div
                            v-for="place in searchResults"
                            :key="place.id"
                            class="search-result-card"
                            @click="selectFromSearchResult(place)"
                        >
                            <div class="result-card-content">
                                <div class="result-main-info">
                                    <h4 class="place-name">{{ place.name }}</h4>
                                    <span class="place-type">{{ place.type }}</span>
                                </div>

                                <div class="result-details">
                                    <p class="place-address">📍 {{ place.address }}</p>
                                    <p class="place-category">🏷️ {{ place.categoryName }}</p>
                                    <p v-if="place.phone" class="place-phone">📞 {{ place.phone }}</p>
                                    <p v-if="place.distance" class="place-distance">📏 {{ place.distance }}m</p>
                                </div>

                                <div class="result-actions">
                                    <button @click.stop="selectFromSearchResult(place)" class="btn-select-place">
                                        📍 지도에서 보기
                                    </button>
                                    <button @click.stop="addToSchedule(place)" class="btn-add-schedule">
                                        ➕ 일정에 추가
                                    </button>
                                    <a
                                        v-if="place.placeUrl"
                                        :href="place.placeUrl"
                                        target="_blank"
                                        class="btn-kakao-link"
                                        @click.stop
                                    >
                                        🔗 카카오맵
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- 검색 결과 없음 -->
                        <div v-if="!isSearching && searchResults.length === 0" class="no-results">
                            <p>🔍 검색 결과가 없습니다.</p>
                            <p>다른 키워드로 검색해보세요.</p>
                        </div>
                    </div>
                </div>

                <!-- 하단 버튼 -->
                <div class="bottom-buttons">
                    <button @click="completePlan" class="complete-btn">완료</button>
                    <button @click="cancelPlan" class="cancel-btn">취소</button>
                </div>
            </div>

            <!-- 우측 사이드바 -->
            <div class="sidebar">
                <!-- 관광지 정보 카드 -->
                <div class="attraction-info-card">
                    <div class="card-header">
                        <h3>{{ selectedAttraction ? selectedAttraction.name : "관광지 명" }}</h3>
                        <span class="attraction-type-badge">
                            {{ selectedAttraction ? selectedAttraction.type : "TYPE" }}
                        </span>
                    </div>
                    <div class="card-body">
                        <p class="attraction-address">
                            {{ selectedAttraction ? selectedAttraction.address : "주소" }}
                        </p>
                        <p class="attraction-description">
                            {{
                                selectedAttraction
                                    ? selectedAttraction.description
                                    : "지도에서 장소를 선택하거나 검색해주세요"
                            }}
                        </p>
                        <div v-if="selectedAttraction && selectedAttraction.placeUrl" class="place-link">
                            <a :href="selectedAttraction.placeUrl" target="_blank" class="place-url-btn">
                                🔗 카카오맵에서 보기
                            </a>
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
                    </button>
                </div>

                <!-- 일정 계획 박스 -->
                <div class="day-plan-container">
                    <div class="plan-header">
                        <p>일정을 추가해보세요!</p>
                    </div>
                    <div class="day-plan-box">
                        <div v-for="(item, index) in dayPlans[activeDay]" :key="index" class="plan-item">
                            <div class="plan-item-info">
                                <span class="plan-item-name">{{ item.name }}</span>
                                <span class="plan-item-type">{{ item.type }}</span>
                            </div>
                            <button @click="removePlanItem(activeDay, index)" class="remove-btn">×</button>
                        </div>

                        <!-- 빈 상태일 때 -->
                        <div v-if="!dayPlans[activeDay] || dayPlans[activeDay].length === 0" class="empty-plan">
                            지도에서 장소를 선택하여 일정에 추가해보세요
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";

const route = useRoute();
const router = useRouter();

// 카카오 API 설정 - 환경변수에서 가져오기
const KAKAO_REST_API_KEY = process.env.VUE_APP_KAKAO_REST_API_KEY;
const KAKAO_MAP_KEY = process.env.VUE_APP_KAKAO_MAP_KEY;

// 디버깅용 로그
console.log("🔍 환경변수 디버깅:");
console.log("KAKAO_REST_API_KEY:", KAKAO_REST_API_KEY);
console.log("KAKAO_MAP_KEY:", KAKAO_MAP_KEY);
console.log(
    "모든 VUE_APP_ 환경변수:",
    Object.keys(process.env).filter((key) => key.startsWith("VUE_APP_"))
);

// 반응형 데이터
const searchQuery = ref("");
const mapCenter = reactive({
    lat: 35.1595454, // 광주 중심 좌표
    lng: 126.8526012,
});

const attractions = ref([
    // 샘플 관광지 데이터
    {
        id: 1,
        name: "광주 국립박물관",
        type: "박물관",
        address: "광주광역시 북구 하서로 110",
        description: "광주 지역의 역사와 문화를 한눈에 볼 수 있는 박물관",
        lat: 35.1789,
        lng: 126.9115,
    },
    {
        id: 2,
        name: "양림동 펭귄마을",
        type: "관광지",
        address: "광주광역시 남구 제중로47번길 13",
        description: "아기자기한 벽화와 카페가 있는 힐링 공간",
        lat: 35.1456,
        lng: 126.9176,
    },
    {
        id: 3,
        name: "무등산국립공원",
        type: "자연",
        address: "광주광역시 북구 무등로",
        description: "광주의 대표적인 산으로 등산과 자연 감상 명소",
        lat: 35.1347,
        lng: 126.9888,
    },
]);

// 기본값으로 초기화
const planData = ref({
    planId: null,
    totalDays: 1, // 기본값 설정
});

const days = ref([1]);
const activeDay = ref(1);
const dayPlans = reactive({ 1: [] });

// planData가 설정되면 동적으로 업데이트
watch(
    () => planData.value?.totalDays, // safe navigation operator 사용
    (newTotalDays) => {
        if (newTotalDays && newTotalDays > 0) {
            console.log("총 일수 변경:", newTotalDays);
            console.log(planData.value.totalDays);

            // days 배열 업데이트
            days.value = Array.from({ length: newTotalDays }, (_, i) => i + 1);

            // dayPlans 객체 초기화
            Object.keys(dayPlans).forEach((key) => delete dayPlans[key]);
            for (let i = 1; i <= newTotalDays; i++) {
                dayPlans[i] = [];
            }

            // activeDay가 범위를 벗어나면 1로 설정
            if (activeDay.value > newTotalDays) {
                activeDay.value = 1;
            }

            console.log(`${newTotalDays}일 계획으로 초기화됨`);
        }
    },
    { immediate: true } // 즉시 실행
);

const selectedAttraction = ref(null);
const searchResults = ref([]); // 검색 결과 리스트
const isSearching = ref(false); // 검색 중 상태

// 메서드들
const searchAttractions = async () => {
    if (!searchQuery.value.trim()) {
        alert("검색어를 입력해주세요!");
        return;
    }

    isSearching.value = true;

    try {
        console.log("장소 검색 시작:", searchQuery.value);

        // 카카오 Places API 호출
        const searchData = await searchPlacesByKeyword(searchQuery.value);

        if (searchData && searchData.length > 0) {
            // 검색 결과를 searchResults에 저장
            searchResults.value = searchData.map((place, index) => ({
                id: `search_${Date.now()}_${index}`,
                name: place.place_name,
                type: getCategoryType(place.category_name),
                address: place.road_address_name || place.address_name,
                description: `${place.category_name}${place.phone ? ` - ${place.phone}` : ""}`,
                lat: parseFloat(place.y),
                lng: parseFloat(place.x),
                placeUrl: place.place_url,
                distance: place.distance || "",
                categoryName: place.category_name,
                phone: place.phone || "전화번호 없음",
            }));

            console.log(`${searchResults.value.length}개의 검색 결과를 찾았습니다.`);
        } else {
            searchResults.value = [];
            alert("검색 결과가 없습니다. 다른 키워드로 시도해보세요.");
        }
    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

// 검색 결과에서 장소 선택 (지도에만 표시, 일정 추가 안함)
const selectFromSearchResult = (place) => {
    // 지도에 마커 추가
    const existingAttraction = attractions.value.find((attr) => attr.id === place.id);

    if (!existingAttraction) {
        attractions.value.push(place);
    }

    // 선택된 장소로 지도 중심 이동
    mapCenter.lat = place.lat;
    mapCenter.lng = place.lng;

    // 선택된 장소 정보만 표시 (일정에 추가하지 않음)
    selectedAttraction.value = place;
    showPlaceDetails(place);

    console.log("지도에서 장소 표시:", place.name);
};

// 검색 결과 전체를 지도에 추가
const addAllSearchResultsToMap = () => {
    if (searchResults.value.length === 0) {
        alert("검색 결과가 없습니다.");
        return;
    }

    // 기존에 없는 장소만 추가
    const newPlaces = searchResults.value.filter(
        (searchPlace) => !attractions.value.some((attr) => attr.id === searchPlace.id)
    );

    attractions.value = [...attractions.value, ...newPlaces];

    // 검색 결과 첫 번째 장소로 지도 중심 이동
    if (newPlaces.length > 0) {
        mapCenter.lat = newPlaces[0].lat;
        mapCenter.lng = newPlaces[0].lng;
    }

    alert(`${newPlaces.length}개의 새로운 장소가 지도에 추가되었습니다!`);
};

// 검색 결과 초기화
const clearSearchResults = () => {
    searchResults.value = [];
    searchQuery.value = "";
    console.log("검색 결과가 초기화되었습니다.");
};

// 카카오 Places API 키워드 검색 함수
const searchPlacesByKeyword = async (keyword) => {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json`;

    try {
        const response = await fetch(`${url}?query=${encodeURIComponent(keyword)}&size=10`, {
            method: "GET",
            headers: {
                Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.documents || [];
    } catch (error) {
        console.error("카카오 API 호출 오류:", error);
        throw error;
    }
};

// 카테고리 이름을 간단한 타입으로 변환하는 함수
const getCategoryType = (categoryName) => {
    if (categoryName.includes("음식점") || categoryName.includes("카페")) return "맛집";
    if (categoryName.includes("관광") || categoryName.includes("명소")) return "관광지";
    if (categoryName.includes("숙박") || categoryName.includes("호텔")) return "숙박";
    if (categoryName.includes("문화") || categoryName.includes("박물관")) return "문화";
    if (categoryName.includes("쇼핑") || categoryName.includes("마트")) return "쇼핑";
    return "기타";
};

// 근처 카테고리별 장소 검색 함수
const searchNearbyPlaces = async (categoryCode) => {
    const url = `https://dapi.kakao.com/v2/local/search/category.json`;

    try {
        const response = await fetch(
            `${url}?category_group_code=${categoryCode}&x=${mapCenter.lng}&y=${mapCenter.lat}&radius=5000&size=10`,
            {
                method: "GET",
                headers: {
                    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
                },
            }
        );

        const data = await response.json();
        return data.documents || [];
    } catch (error) {
        console.error("근처 장소 검색 오류:", error);
        return [];
    }
};

// 특정 카테고리로 근처 장소 검색하기
const searchByCategory = async (categoryCode, categoryName) => {
    isSearching.value = true;

    try {
        console.log(`${categoryName} 검색 중...`);
        const results = await searchNearbyPlaces(categoryCode);

        if (results.length > 0) {
            // 검색 결과를 searchResults에 저장 (리스트로 표시)
            searchResults.value = results.map((place, index) => ({
                id: `category_${categoryCode}_${Date.now()}_${index}`,
                name: place.place_name,
                type: categoryName,
                address: place.road_address_name || place.address_name,
                description: `${place.category_name}${place.phone ? ` - ${place.phone}` : ""}`,
                lat: parseFloat(place.y),
                lng: parseFloat(place.x),
                placeUrl: place.place_url,
                distance: place.distance || "",
                categoryName: place.category_name,
                phone: place.phone || "전화번호 없음",
            }));

            // 검색어 표시 업데이트
            searchQuery.value = `근처 ${categoryName}`;

            console.log(`근처 ${categoryName} ${searchResults.value.length}개를 찾았습니다.`);
        } else {
            searchResults.value = [];
            alert(`근처에 ${categoryName}을(를) 찾을 수 없습니다.`);
        }
    } catch (error) {
        console.error(`${categoryName} 검색 오류:`, error);
        alert(`${categoryName} 검색 중 오류가 발생했습니다.`);
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
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

const onMapCenterChanged = (map) => {
    const center = map.getCenter();
    mapCenter.lat = center.getLat();
    mapCenter.lng = center.getLng();
};

// 지도에서 마커 클릭 시 상세 정보 표시
const showPlaceDetails = (attraction) => {
    selectedAttraction.value = attraction;
    console.log("선택된 장소 상세 정보:", attraction);
};

// 일정에 장소 추가하는 별도 함수
const addToSchedule = (place) => {
    // 선택된 관광지를 현재 활성 DAY에 추가
    if (!dayPlans[activeDay.value]) {
        dayPlans[activeDay.value] = [];
    }

    // 중복 체크
    const exists = dayPlans[activeDay.value].some((item) => item.id === place.id);
    if (!exists) {
        dayPlans[activeDay.value].push({
            id: place.id,
            name: place.name,
            type: place.type,
            address: place.address,
            lat: place.lat,
            lng: place.lng,
            description: `${place.categoryName}${place.phone ? ` - ${place.phone}` : ""}`,
            categoryName: place.categoryName,
            phone: place.phone || "전화번호 없음",
        });
        alert(`${place.name}이(가) DAY${activeDay.value} 일정에 추가되었습니다!`);
    } else {
        alert("이미 일정에 추가된 장소입니다.");
    }
};

const selectAttraction = (attraction) => {
    selectedAttraction.value = attraction;
    showPlaceDetails(attraction);
    console.log("선택된 관광지:", attraction);

    // 지도 마커 클릭 시에만 자동으로 일정에 추가
    addToSchedule(attraction);
};

const clearMapResults = () => {
    // 검색으로 추가된 결과만 제거 (샘플 데이터는 유지)
    attractions.value = attractions.value.filter(
        (attr) => !attr.id.toString().startsWith("search_") && !attr.id.toString().startsWith("category_")
    );
    console.log("지도의 검색 결과가 지워졌습니다.");
};

const setActiveDay = (day) => {
    activeDay.value = day;
    console.log("활성 DAY 변경:", day);
};

const removePlanItem = (day, index) => {
    dayPlans[day].splice(index, 1);
    console.log(`DAY${day}에서 일정 제거:`, index);
};

import axios from "axios";

const completePlan = async () => {
    const routesToSave = [];

    // dayPlans 데이터를 Routes 테이블 형식으로 변환
    Object.entries(dayPlans).forEach(([day, places]) => {
        places.forEach((place, index) => {
            console.log("place : ", place);
            routesToSave.push({
                plan_id: parseInt(planData.value.planId),
                day: parseInt(day),
                sequence: index + 1,
                name: place.name,
                address: place.address,
                latitude: place.lat || null,
                longitude: place.lng || null,
                type: place.type,
                category_name: place.categoryName,
                phone: place.phone || "전화번호 없음",
            });
        });
    });

    console.log("저장할 라우트 데이터:", routesToSave);

    if (routesToSave.length === 0) {
        throw new Error("저장할 일정이 없습니다.");
    }

    try {
        await axios.post("http://localhost:8080/routes", routesToSave, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
            },
        });

        console.log("모든 데이터 저장 완료");

        router.push("/plans");
        return { success: true };
    } catch (error) {
        console.error("저장 중 오류:", error);
        throw error;
    }
};

const cancelPlan = () => {
    if (confirm("정말로 취소하시겠습니까? 작성된 내용이 사라집니다.")) {
        // 초기화 또는 이전 페이지로 이동
        Object.keys(dayPlans).forEach((key) => {
            dayPlans[key] = [];
        });
        console.log("계획 취소됨");
    }
};

// 컴포넌트 마운트 시
onMounted(() => {
    planData.value = {
        planId: route.params.planId,
        totalDays: parseInt(route.query.totalDays),
    };
    console.log("planDATA");
    console.log(planData.value);

    console.log("여행 계획 생성 컴포넌트 로드됨");

    // 카카오 API 키 확인
    if (KAKAO_REST_API_KEY === "YOUR_KAKAO_REST_API_KEY_HERE") {
        console.warn("⚠️ 카카오 REST API 키를 설정해주세요!");
        console.log("📝 .env 파일에 VUE_APP_KAKAO_REST_API_KEY=your_rest_api_key 추가");
    }

    if (KAKAO_MAP_KEY === "YOUR_KAKAO_MAP_KEY_HERE") {
        console.warn("⚠️ 카카오 Map JavaScript 키를 설정해주세요!");
        console.log("📝 .env 파일에 VUE_APP_KAKAO_MAP_KEY=your_javascript_key 추가");
    }

    if (KAKAO_REST_API_KEY !== "YOUR_KAKAO_REST_API_KEY_HERE" && KAKAO_MAP_KEY !== "YOUR_KAKAO_MAP_KEY_HERE") {
        console.log("✅ 카카오 API 키가 정상적으로 설정되었습니다!");
    }
});
</script>

<style scoped>
.travel-planner-container {
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

/* 검색 컨테이너 */
.search-container {
    display: flex;
    gap: 0.625rem;
    margin-bottom: 0.9rem;
    align-items: center;
}

.search-bar {
    flex: 1;
    display: flex;
    border: 0.125rem solid #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
}

.search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    outline: none;
    font-size: 1rem;
}

.search-input::placeholder {
    color: #999;
}

.search-btn {
    padding: 0.75rem 1.25rem;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
}

.search-btn:hover:not(:disabled) {
    background-color: #45a049;
}

.search-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.location-btn {
    padding: 0.75rem 1rem;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    white-space: nowrap;
}

.location-btn:hover {
    background-color: #1976d2;
}

/* 카테고리 검색 버튼 */
.category-buttons {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.9rem;
    flex-wrap: wrap;
}

.category-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 1.25rem;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.category-btn.food {
    background-color: #ff6b6b;
    color: white;
}

.category-btn.cafe {
    background-color: #8b4513;
    color: white;
}

.category-btn.tourist {
    background-color: #4dabf7;
    color: white;
}

.category-btn.hotel {
    background-color: #69db7c;
    color: white;
}

.category-btn.clear {
    background-color: #868e96;
    color: white;
}

.category-btn:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
}

/* 지도 컨테이너 */
.map-container {
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
    margin-bottom: 1.25rem;
    height: 31.25rem;
    width: 100%;
}

/* 검색 결과 리스트 */
.search-results {
    background-color: #f8f9fa;
    border-radius: 0.75rem;
    margin-top: 0.9rem;
    margin-bottom: 1rem;
    padding: 1.25rem;
    border: 0.063rem solid #e9ecef;
    max-height: 50rem;
    overflow-y: auto;
}

.search-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.9rem;
    flex-wrap: wrap;
    gap: 0.625rem;
}

.search-results-header h3 {
    margin: 0;
    color: #495057;
    font-size: 1.1rem;
}

.loading {
    color: #007bff;
    font-weight: normal;
}

.search-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-add-all,
.btn-clear-search {
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-add-all {
    background-color: #28a745;
    color: white;
}

.btn-clear-search {
    background-color: #dc3545;
    color: white;
}

.btn-clear-search:hover:not(:disabled) {
    background-color: #c82333;
}

.btn-add-all:disabled,
.btn-clear-search:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 검색 결과 리스트 */
.search-results-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* 로딩 스피너 */
.loading-spinner {
    text-align: center;
    padding: 2.5rem 1.25rem;
    color: #6c757d;
}

.spinner {
    border: 0.188rem solid #f3f3f3;
    border-top: 0.188rem solid #007bff;
    border-radius: 50%;
    width: 1.875rem;
    height: 1.875rem;
    animation: spin 1s linear infinite;
    margin: 0 auto 0.9rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* 검색 결과 카드 */
.search-result-card {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    border: 0.063rem solid #dee2e6;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0.063rem 0.188rem rgba(0, 0, 0, 0.05);
}

.search-result-card:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
    border-color: #007bff;
}

.result-card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.result-main-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.place-name {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
}

.place-type {
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.8rem;
    font-weight: 500;
}

.result-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.result-details p {
    margin: 0;
    font-size: 0.9rem;
    color: #6c757d;
}

.place-address {
    color: #495057 !important;
    font-weight: 500;
}

.result-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.btn-select-place,
.btn-add-schedule,
.btn-kakao-link {
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-select-place {
    background-color: #007bff;
    color: white;
}

.btn-select-place:hover {
    background-color: #0056b3;
}

.btn-add-schedule {
    background-color: #28a745;
    color: white;
}

.btn-add-schedule:hover {
    background-color: #218838;
}

.btn-kakao-link {
    background-color: #fee500;
    color: #3c1e1e;
    font-weight: 600;
}

.btn-kakao-link:hover {
    background-color: #fdd700;
}

/* 검색 결과 없음 */
.no-results {
    text-align: center;
    padding: 2.5rem 1.25rem;
    color: #6c757d;
}

.no-results p {
    margin: 0.313rem 0;
}

/* 하단 버튼 */
.bottom-buttons {
    display: flex;
    gap: 1.25rem;
    justify-content: center;
    margin-top: 1rem;
}

.complete-btn,
.cancel-btn {
    width: 10rem;
    height: 3.125rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.complete-btn {
    background-color: #7eb9e6;
    color: white;
}

.complete-btn:hover {
    background-color: #6ba3d0;
    transform: translateY(-0.125rem);
}

.cancel-btn {
    background-color: #f0f0f0;
    color: #666;
}

.cancel-btn:hover {
    background-color: #e0e0e0;
    transform: translateY(-0.125rem);
}

/* 우측 사이드바 */
.sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 18.75rem;
}

/* 관광지 정보 카드 */
.attraction-info-card {
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

.attraction-type-badge {
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

.attraction-address {
    font-size: 0.95rem;
    margin: 0.5rem 0;
}

.attraction-description {
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
}

.place-link {
    margin-top: 0.75rem;
}

.place-url-btn {
    display: inline-block;
    background-color: #fee500;
    color: #3c1e1e;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.place-url-btn:hover {
    background-color: #fdd700;
    transform: translateY(-0.063rem);
}

/* DAY 추가 버튼 */
/* .add-day-btn {
    background-color: #e3f2fd;
    color: #1976d2;
    border: 0.125rem dashed #90caf9;
    border-radius: 0.5rem;
    padding: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.add-day-btn:hover {
    background-color: #bbdefb;
    border-color: #64b5f6;
} */

/* DAY 탭들 */
.day-tabs {
    display: flex;
    gap: 0.375rem;
}

.day-tab {
    flex: 1;
    padding: 0.625rem 0.75rem;
    background-color: #f5f5f5;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.day-tab.active {
    background-color: #4a90e2;
    color: white;
    transform: translateY(-0.063rem);
}

.day-tab:hover:not(.active) {
    background-color: #e8e8e8;
}

/* 일정 계획 컨테이너 */
.day-plan-container {
    flex: 1;
}

.plan-header {
    background-color: #f8f9fa;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem 0.5rem 0 0;
    border: 0.063rem solid #dee2e6;
    border-bottom: none;
}

.plan-header p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
}

.day-plan-box {
    background-color: white;
    border: 0.063rem solid #dee2e6;
    border-radius: 0 0 0.5rem 0.5rem;
    padding: 1rem;
    min-height: 23rem;
    max-height: 23rem;
    overflow-y: auto;
}

/* 일정 아이템 */
.plan-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border: 0.063rem solid #e9ecef;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.plan-item:hover {
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
}

.plan-item-info {
    flex: 1;
}

.plan-item-name {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
}

.plan-item-type {
    display: inline-block;
    background-color: #e3f2fd;
    color: #1976d2;
    font-size: 0.8rem;
    padding: 0.125rem 0.5rem;
    border-radius: 0.625rem;
}

.remove-btn {
    background-color: #ff4757;
    color: white;
    border: none;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    line-height: 1;
}

.remove-btn:hover {
    background-color: #ff3838;
}

/* 빈 상태 */
.empty-plan {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 2.5rem 1.25rem;
    line-height: 1.5;
}

/* 스크롤바 스타일 */
.day-plan-box::-webkit-scrollbar,
.search-results::-webkit-scrollbar {
    width: 0.375rem;
}

.day-plan-box::-webkit-scrollbar-thumb,
.search-results::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 0.188rem;
}

.day-plan-box::-webkit-scrollbar-track,
.search-results::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

/* 반응형 디자인 */
/* 태블릿 (768px ~ 1024px) */
@media (max-width: 64rem) and (min-width: 48rem) {
    .travel-planner-container {
        padding: 1rem;
    }

    .main-title {
        font-size: 1.75rem;
    }

    .content-wrapper {
        gap: 1rem;
    }

    .category-buttons {
        gap: 0.375rem;
    }

    .category-btn {
        padding: 0.375rem 0.625rem;
        font-size: 0.8rem;
    }

    .map-container {
        height: 25rem;
    }

    .search-results {
        max-height: 31.25rem;
        padding: 1rem;
        margin-bottom: 2.5rem;
    }

    .sidebar {
        min-width: 15rem;
    }

    .attraction-info-card {
        padding: 1rem;
    }

    .day-plan-box {
        min-height: 10rem;
        max-height: 15rem;
    }
}

/* 모바일 (최대 768px) */
@media (max-width: 48rem) {
    .travel-planner-container {
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

    /* 검색 영역 */
    .search-container {
        flex-direction: column;
        gap: 0.5rem;
    }

    .search-bar {
        margin-bottom: 0;
        border: 0.063rem solid #e0e0e0;
    }

    .search-input {
        padding: 0.875rem 1rem;
        font-size: 1rem;
    }

    .search-btn {
        padding: 0.875rem 1rem;
        font-size: 0.9rem;
    }

    .location-btn {
        padding: 0.75rem;
        font-size: 0.9rem;
        width: 100%;
    }

    /* 카테고리 버튼 */
    .category-buttons {
        justify-content: center;
        gap: 0.375rem;
    }

    .category-btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        flex: 1;
        min-width: 0;
    }

    /* 지도 */
    .map-container {
        height: 18.75rem;
        margin-bottom: 1rem;
    }

    /* 검색 결과 */
    .search-results {
        margin-top: 1rem;
        margin-bottom: 2rem;
        padding: 1rem;
        max-height: 25rem;
        border: 0.063rem solid #e9ecef;
    }

    .search-results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .search-results-header h3 {
        font-size: 1rem;
    }

    .search-actions {
        width: 100%;
        justify-content: space-between;
    }

    .btn-add-all,
    .btn-clear-search {
        flex: 1;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
    }

    /* 검색 결과 카드 */
    .search-result-card {
        padding: 0.875rem;
        border: 0.063rem solid #dee2e6;
    }

    .result-main-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
    }

    .place-name {
        font-size: 1rem;
    }

    .place-type {
        align-self: flex-start;
    }

    .result-details {
        gap: 0.375rem;
    }

    .result-details p {
        font-size: 0.85rem;
    }

    .result-actions {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.375rem;
    }

    .btn-select-place,
    .btn-add-schedule,
    .btn-kakao-link {
        flex: 1;
        min-width: calc(50% - 0.1875rem);
        padding: 0.5rem 0.625rem;
        font-size: 0.8rem;
        text-align: center;
    }

    /* 하단 버튼 */
    .bottom-buttons {
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }

    .complete-btn,
    .cancel-btn {
        width: 100%;
        height: 2.75rem;
        font-size: 1rem;
    }

    /* 사이드바 */
    .sidebar {
        gap: 0.875rem;
    }

    .attraction-info-card {
        padding: 1rem;
        border: 0.063rem solid #e9ecef;
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

    .attraction-type-badge {
        align-self: flex-start;
    }

    /* DAY 탭 */
    .day-tabs {
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .day-tab {
        flex: 1;
        min-width: calc(25% - 0.1875rem);
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
    }

    /* 일정 박스 */
    .plan-header {
        border: 0.063rem solid #dee2e6;
    }

    .day-plan-box {
        min-height: 8rem;
        max-height: 12rem;
        padding: 0.875rem;
        border: 0.063rem solid #dee2e6;
    }

    .plan-item {
        padding: 0.625rem;
        margin-bottom: 0.375rem;
        border: 0.063rem solid #e9ecef;
    }

    .plan-item-name {
        font-size: 0.9rem;
    }

    .plan-item-type {
        font-size: 0.75rem;
    }

    .remove-btn {
        width: 1.25rem;
        height: 1.25rem;
        font-size: 0.875rem;
    }

    .empty-plan {
        padding: 1.5rem 1rem;
        font-size: 0.875rem;
    }

    .spinner {
        border: 0.125rem solid #f3f3f3;
        border-top: 0.125rem solid #007bff;
    }
}

/* 작은 모바일 (최대 480px) */
@media (max-width: 30rem) {
    .travel-planner-container {
        padding: 0.5rem;
    }

    .main-title {
        font-size: 1.25rem;
    }

    .title-underline {
        width: 8rem;
    }

    .search-input,
    .search-btn {
        padding: 0.75rem 0.875rem;
        font-size: 0.9rem;
    }

    .search-bar {
        border: 0.063rem solid #e0e0e0;
    }

    .category-buttons {
        flex-direction: column;
        gap: 0.5rem;
    }

    .category-btn {
        width: 100%;
        padding: 0.75rem;
        font-size: 0.875rem;
    }

    .map-container {
        height: 15rem;
    }

    .search-results {
        max-height: 18.75rem;
        padding: 0.75rem;
        margin-bottom: 1.5rem;
        border: 0.063rem solid #e9ecef;
    }

    .search-results-header h3 {
        font-size: 0.9rem;
    }

    .search-result-card {
        padding: 0.75rem;
        border: 0.063rem solid #dee2e6;
    }

    .place-name {
        font-size: 0.95rem;
    }

    .result-details p {
        font-size: 0.8rem;
    }

    .result-actions {
        flex-direction: column;
    }

    .btn-select-place,
    .btn-add-schedule,
    .btn-kakao-link {
        width: 100%;
        min-width: auto;
        margin-bottom: 0.25rem;
    }

    .day-tabs {
        flex-direction: column;
    }

    .day-tab {
        min-width: auto;
        width: 100%;
        margin-bottom: 0.25rem;
    }

    .plan-header {
        border: 0.063rem solid #dee2e6;
    }

    .day-plan-box {
        min-height: 6rem;
        max-height: 10rem;
        border: 0.063rem solid #dee2e6;
    }

    .plan-item {
        border: 0.063rem solid #e9ecef;
    }

    .attraction-info-card {
        padding: 0.75rem;
        border: 0.063rem solid #e9ecef;
    }

    .card-header h3 {
        font-size: 1rem;
    }

    .bottom-buttons {
        margin-top: 1.25rem;
    }

    .spinner {
        border: 0.125rem solid #f3f3f3;
        border-top: 0.125rem solid #007bff;
    }
}

/* 가로 모드 모바일 */
@media (max-width: 48rem) and (orientation: landscape) {
    .map-container {
        height: 12.5rem;
    }

    .search-results {
        max-height: 12.5rem;
        margin-bottom: 1.5rem;
    }

    .day-plan-box {
        max-height: 8rem;
    }

    .content-wrapper {
        gap: 0.75rem;
    }
}

/* 고해상도 디스플레이 최적화 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .search-result-card,
    .plan-item,
    .attraction-info-card {
        border-width: 0.031rem;
    }

    .search-bar,
    .plan-header,
    .day-plan-box {
        border-width: 0.031rem;
    }

    /* .add-day-btn {
        border-width: 0.063rem;
    } */

    .spinner {
        border-width: 0.094rem;
        border-top-width: 0.094rem;
    }
}
</style>
