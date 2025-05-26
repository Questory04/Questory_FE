<template>
    <div class="travel-plans-container">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <!-- 페이지 타이틀 -->
            <div class="page-header">
                <h2 class="page-title">여행 계획 상세</h2>
                <div class="title-underline"></div>
            </div>

            <!-- 액션 버튼 -->
            <div class="action-section">
                <button @click="goToCreatePlan" class="create-plan-btn">
                    <span class="btn-icon">+</span>
                    새 여행 계획 만들기
                </button>

                <select v-model="sortBy" class="sort-select">
                    <option value="recent">최신순</option>
                    <option value="startDate">출발일순</option>
                </select>
            </div>

            <!-- 로딩 상태 -->
            <div v-if="loading" class="loading-section">
                <div class="loading-spinner"></div>
                <p>여행 계획을 불러오는 중...</p>
            </div>

            <!-- 에러 상태 -->
            <div v-else-if="error" class="error-section">
                <div class="error-icon">⚠️</div>
                <h3>계획을 불러올 수 없습니다</h3>
                <p>{{ error }}</p>
                <button @click="loadTravelPlans" class="retry-btn">다시 시도</button>
            </div>

            <!-- 여행 계획 리스트 -->
            <div v-else class="plans-section">
                <!-- 계획 목록이 있을 때 -->
                <div v-if="filteredPlans.length > 0" class="plans-grid">
                    <div
                        v-for="plan in paginatedPlans"
                        :key="plan.planId"
                        class="plan-card"
                        @click="goToPlanDetail(plan.planId)"
                    >
                        <!-- 계획 정보 -->
                        <div class="card-content">
                            <div class="plan-header-info">
                                <h3 class="plan-title">{{ plan.planTitle }}</h3>
                                <div class="plan-dates">
                                    <span class="date-badge">{{ formatDateRange(plan.startDate, plan.endDate) }}</span>
                                    <span class="duration-badge">{{ plan.duration }}일</span>
                                </div>
                            </div>

                            <div class="plan-meta">
                                <div class="meta-item">
                                    <span class="meta-icon">📝</span>
                                    <span>{{ plan.routesCnt }}곳</span>
                                </div>
                            </div>

                            <div v-if="plan.description" class="plan-description">
                                {{ truncateText(plan.planDescription, 80) }}
                            </div>

                            <!-- 진행률 -->
                            <div class="progress-label">계획 진행률</div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: `${plan.completionRate}%` }"></div>
                            </div>
                            <div class="progress-text">{{ plan.completionRate }}%</div>
                        </div>

                        <!-- 카드 푸터 -->
                        <div class="card-footer">
                            <div class="created-info">{{ formatDate(plan.createdAt) }} 생성</div>
                            <div class="days-until" v-if="getDaysUntil(plan.startDate) > 0">
                                {{ getDaysUntil(plan.startDate) }}일 후 출발
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 빈 상태 -->
                <div v-else class="empty-state">
                    <div class="empty-illustration">
                        <div class="empty-icon">✈️</div>
                        <div class="empty-bg"></div>
                    </div>
                    <h3>아직 여행 계획이 없어요</h3>
                    <p>첫 번째 여행 계획을 세워보세요!</p>
                    <button @click="goToCreatePlan" class="create-first-plan-btn">여행 계획 만들기</button>
                </div>

                <!-- 페이지네이션 -->
                <div v-if="totalPages > 1" class="pagination-section">
                    <button
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="page-btn prev-btn"
                    >
                        이전
                    </button>

                    <div class="page-numbers">
                        <button
                            v-for="page in visiblePages"
                            :key="page"
                            @click="changePage(page)"
                            :class="['page-number', { active: currentPage === page }]"
                        >
                            {{ page }}
                        </button>
                    </div>

                    <button
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="page-btn next-btn"
                    >
                        다음
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// 반응형 상태
const loading = ref(true);
const error = ref(null);
const plans = ref([]);
const searchQuery = ref("");
const statusFilter = ref("");
const sortBy = ref("recent");
const activeMenu = ref(null);
const currentPage = ref(1);
const plansPerPage = 9;

// 계산된 속성들
const filteredPlans = computed(() => {
    let filtered = plans.value;

    // 검색 필터
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (plan) => plan.title.toLowerCase().includes(query) || plan.destination.toLowerCase().includes(query)
        );
    }

    // 상태 필터
    if (statusFilter.value) {
        filtered = filtered.filter((plan) => plan.status === statusFilter.value);
    }

    // 정렬
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case "recent":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "startDate":
                return new Date(a.startDate) - new Date(b.startDate);
            case "title":
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    return filtered;
});

const totalPages = computed(() => Math.ceil(filteredPlans.value.length / plansPerPage));

const paginatedPlans = computed(() => {
    const start = (currentPage.value - 1) * plansPerPage;
    const end = start + plansPerPage;
    return filteredPlans.value.slice(start, end);
});

const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// 메서드들
const loadTravelPlans = async () => {
    loading.value = true;
    error.value = null;

    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get("http://localhost:8080/plans/me/created", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // 샘플 데이터 (실제 API 응답에 맞게 수정 필요)
        plans.value = response.data;

        console.log("여행 계획 목록 로드 완료:", plans.value);
    } catch (err) {
        console.error("계획 로드 중 오류:", err);
        if (err.response?.status === 401) {
            error.value = "로그인이 만료되었습니다. 다시 로그인해주세요.";
            setTimeout(() => router.push("/login"), 2000);
        } else {
            error.value = err.response?.data?.message || "계획을 불러오는 중 오류가 발생했습니다.";
        }
    } finally {
        loading.value = false;
    }
};

const goToCreatePlan = () => {
    router.push("/plans/create");
};

const goToPlanDetail = (planId) => {
    router.push(`/plans/${planId}`);
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    const end = new Date(endDate).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    return `${start} ~ ${end}`;
};

const getDaysUntil = (startDate) => {
    if (!startDate) return -1;
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
};

// 이벤트 리스너
watch([searchQuery, statusFilter], () => {
    currentPage.value = 1;
});

// 외부 클릭 시 메뉴 닫기
const handleClickOutside = () => {
    activeMenu.value = null;
};

onMounted(() => {
    loadTravelPlans();
    document.addEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.travel-plans-container {
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 메인 컨텐츠 */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    color: #6fa8dc;
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
}

.title-underline {
    width: 60px;
    height: 3px;
    background-color: #6fa8dc;
    margin: 0 auto;
}

/* 액션 섹션 */
.action-section {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
}

.create-plan-btn {
    background-color: #6fa8dc;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin-right: 1rem;
}

.create-plan-btn:hover {
    background-color: #5a96d1;
    transform: translateY(-1px);
}

.btn-icon {
    font-size: 1.2rem;
    font-weight: bold;
}

.sort-select {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;
    background-color: white;
}

/* 로딩 및 에러 상태 */
.loading-section,
.error-section {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #6fa8dc;
    border-radius: 50%;
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

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.retry-btn {
    background-color: #6fa8dc;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
}

/* 계획 그리드 */
.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.plan-card {
    background-color: white;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.plan-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e5e5e5;
}

.plan-status {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status-planning {
    background-color: #fff3cd;
    color: #856404;
}

.status-confirmed {
    background-color: #d1ecf1;
    color: #0c5460;
}

.status-completed {
    background-color: #d4edda;
    color: #155724;
}

.card-menu {
    position: relative;
}

.menu-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    color: #666;
}

.menu-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    min-width: 100px;
}

.menu-dropdown button {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
}

.menu-dropdown button:hover {
    background-color: #f8f9fa;
}

.menu-dropdown .delete-btn:hover {
    background-color: #f8d7da;
    color: #721c24;
}

.card-content {
    padding: 1.25rem;
}

.plan-header-info {
    margin-bottom: 1rem;
}

.plan-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.75rem 0;
}

.plan-dates {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.date-badge {
    background-color: #e3f2fd;
    color: #1976d2;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.duration-badge {
    background-color: #f3e5f5;
    color: #7b1fa2;
    padding: 0.25rem 0.5rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.plan-destination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: #666;
    font-size: 0.95rem;
}

.plan-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 0.5rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #666;
    font-size: 0.85rem;
}

.plan-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
}

.progress-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
}

.progress-label {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.progress-bar {
    height: 6px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background-color: #6fa8dc;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.8rem;
    color: #6fa8dc;
    font-weight: 500;
    text-align: right;
}

.card-footer {
    padding: 1rem 1.25rem;
    background-color: #f8f9fa;
    border-top: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #666;
}

.days-until {
    background-color: #fff3cd;
    color: #856404;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-weight: 500;
}

/* 빈 상태 */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
}

.empty-illustration {
    position: relative;
    margin-bottom: 2rem;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
}

.empty-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #6fa8dc 0%, #5a96d1 100%);
    border-radius: 50%;
    opacity: 0.1;
    z-index: -1;
}

.empty-state h3 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #666;
    font-size: 1rem;
    margin-bottom: 2rem;
}

.create-first-plan-btn {
    background-color: #6fa8dc;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.create-first-plan-btn:hover {
    background-color: #5a96d1;
    transform: translateY(-2px);
}

/* 페이지네이션 */
.pagination-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
}

.page-btn {
    padding: 0.75rem 1.25rem;
    border: 1px solid #ddd;
    background-color: white;
    color: #6fa8dc;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
    background-color: #6fa8dc;
    color: white;
    border-color: #6fa8dc;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 0.5rem;
}

.page-number {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    background-color: white;
    color: #666;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    min-width: 44px;
    text-align: center;
}

.page-number:hover {
    background-color: #f8f9fa;
    border-color: #6fa8dc;
}

.page-number.active {
    background-color: #6fa8dc;
    color: white;
    border-color: #6fa8dc;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
    .nav-content {
        padding: 0 1rem;
    }

    .main-content {
        padding: 1.5rem;
    }

    .plans-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 768px) {
    .nav-header {
        padding: 0 1rem;
    }

    .nav-content {
        flex-direction: column;
        height: auto;
        padding: 1rem 0;
        gap: 1rem;
    }

    .nav-menu {
        gap: 1.5rem;
        order: 2;
    }

    .nav-actions {
        order: 3;
    }

    .main-content {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .plans-grid {
        grid-template-columns: 1fr;
    }

    .plan-meta {
        flex-direction: column;
        gap: 0.75rem;
    }

    .meta-item {
        justify-content: center;
    }

    .card-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
        text-align: center;
    }

    .pagination-section {
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .page-numbers {
        order: -1;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    .nav-item {
        font-size: 0.9rem;
    }

    .page-title {
        font-size: 1.25rem;
    }

    .action-section {
        justify-content: center;
    }

    .create-plan-btn {
        width: 100%;
        justify-content: center;
    }

    .plan-dates {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .card-header {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }

    .card-menu {
        align-self: flex-end;
    }

    .empty-state {
        padding: 2rem 1rem;
    }

    .empty-icon {
        font-size: 3rem;
    }

    .create-first-plan-btn {
        width: 100%;
        padding: 1rem;
    }
}

/* 접근성 향상 */
.plan-card:focus {
    outline: 2px solid #6fa8dc;
    outline-offset: 2px;
}

button:focus {
    outline: 2px solid #6fa8dc;
    outline-offset: 1px;
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
    .travel-plans-container {
        background-color: #121212;
        color: #e0e0e0;
    }

    .nav-header {
        background-color: #1e1e1e;
        border-bottom-color: #333;
    }

    .plan-card {
        background-color: #1e1e1e;
        border-color: #333;
    }

    .card-header,
    .card-footer {
        background-color: #2d2d2d;
    }

    .sort-select {
        background-color: #1e1e1e;
        color: #e0e0e0;
        border-color: #333;
    }

    .menu-dropdown {
        background-color: #1e1e1e;
        border-color: #333;
    }
}

/* 애니메이션 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.plan-card {
    animation: fadeInUp 0.3s ease-out;
}

.plan-card:nth-child(2) {
    animation-delay: 0.1s;
}
.plan-card:nth-child(3) {
    animation-delay: 0.2s;
}
.plan-card:nth-child(4) {
    animation-delay: 0.3s;
}
.plan-card:nth-child(5) {
    animation-delay: 0.4s;
}
.plan-card:nth-child(6) {
    animation-delay: 0.5s;
}

/* 호버 효과 개선 */
.create-plan-btn:active {
    transform: translateY(0);
}

.plan-card:active {
    transform: translateY(-2px);
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 로딩 상태 개선 */
.loading-section p {
    margin-top: 1rem;
    font-size: 1rem;
}

/* 상태 배지 개선 */
.plan-status {
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 카드 그림자 효과 */
.plan-card {
    position: relative;
    overflow: visible;
}

.plan-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(111, 168, 220, 0.1) 0%, rgba(90, 150, 209, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
    z-index: -1;
}

.plan-card:hover::before {
    opacity: 1;
}
</style>
