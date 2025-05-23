<template>
    <div class="quest-browsing-page">
        <!-- 메인 컨텐츠 영역 -->
        <main class="main-content">
            <h2 class="title">생성한 퀘스트 조회</h2>
            <div class="title-underline"></div>

            <p class="description">생성한 퀘스트를 관리해보세요!</p>

            <!-- 필터 버튼 -->
            <div class="filter-buttons">
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'all' }"
                    @click="filterQuests('all')"
                >
                    전체
                </button>
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'EASY' }"
                    @click="filterQuests('EASY')"
                >
                    EASY
                </button>
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'MEDIUM' }"
                    @click="filterQuests('MEDIUM')"
                >
                    MEDIUM
                </button>
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'HARD' }"
                    @click="filterQuests('HARD')"
                >
                    HARD
                </button>
            </div>

            <!-- 퀘스트 카드 그리드 -->
            <div class="quest-grid">
                <div v-for="quest in quests" :key="quest.id" class="quest-card">
                    <div class="quest-image">
                        <div class="circle large">
                            <template v-if="quest.attractionImage && quest.attractionImage !== 'null'">
                                <img :src="quest.attractionImage" alt="관광지 이미지" class="circle large" />
                            </template>
                            <template v-else>
                                <span>이미지 없음</span>
                            </template>
                        </div>
                    </div>

                    <div class="quest-info">
                        <h3 class="quest-title">{{ quest.title }}</h3>
                        <div class="difficulty-badge" :class="quest.difficulty.toLowerCase()">
                            {{ quest.difficulty }}
                        </div>
                        <div class="quest-tags">
                            <span class="tag"># {{ quest.attractionTitle }}</span>
                            <span class="tag"># {{ quest.contentTypeTitle }}</span>
                        </div>
                        <button class="detail-btn" @click="openDetailModal(quest)">상세보기</button>
                    </div>
                </div>
            </div>

            <!-- 페이지네이션 -->
            <div v-if="pagination.totalPages > 1" class="pagination">
                <!-- 첫 페이지 이동 버튼 -->
                <button class="pagination-btn" :disabled="pagination.currentPage === 1" @click="changePage(1)">
                    &laquo;
                </button>

                <!-- 이전 페이지 이동 버튼 -->
                <button
                    class="pagination-btn"
                    :disabled="pagination.currentPage === 1"
                    @click="changePage(pagination.currentPage - 1)"
                >
                    &lsaquo;
                </button>

                <!-- 페이지 번호 버튼 -->
                <button
                    v-for="page in visiblePageNumbers"
                    :key="page"
                    class="pagination-btn"
                    :class="{ active: pagination.currentPage === page }"
                    @click="changePage(page)"
                >
                    {{ page }}
                </button>

                <!-- 다음 페이지 이동 버튼 -->
                <button
                    class="pagination-btn"
                    :disabled="pagination.currentPage === pagination.totalPages"
                    @click="changePage(pagination.currentPage + 1)"
                >
                    &rsaquo;
                </button>

                <!-- 마지막 페이지 이동 버튼 -->
                <button
                    class="pagination-btn"
                    :disabled="pagination.currentPage === pagination.totalPages"
                    @click="changePage(pagination.totalPages)"
                >
                    &raquo;
                </button>
            </div>
        </main>

        <!-- 상세 정보 모달 -->
        <div class="modal-overlay" v-if="selectedQuest" @click.self="closeDetailModal">
            <div class="modal-content">
                <button class="close-btn" @click="closeDetailModal">×</button>
                <h3 class="modal-title">{{ selectedQuest.title }}</h3>
                <div class="quest-detail-image">
                    <div class="circle large">
                        <template v-if="selectedQuest.attractionImage && selectedQuest.attractionImage !== 'null'">
                            <img :src="selectedQuest.attractionImage" alt="관광지 이미지" class="circle large" />
                        </template>
                        <template v-else>
                            <span>이미지 없음</span>
                        </template>
                    </div>
                </div>
                <div class="quest-detail-info">
                    <div class="quest-tags">
                        <span class="tag"># {{ selectedQuest.attractionTitle }}</span>
                        <span class="tag"># {{ selectedQuest.contentTypeTitle }}</span>
                        <span class="tag"># {{ selectedQuest.sidoName }}</span>
                    </div>
                    <div class="difficulty-badge" :class="selectedQuest.difficulty.toLowerCase()">
                        {{ selectedQuest.difficulty }}
                    </div>
                    <p class="quest-description">
                        {{ selectedQuest.description || "퀘스트 설명란입니다." }}
                    </p>

                    <div class="modal-buttons">
                        <button class="start-btn" @click="updateQuest">수정하기</button>
                        <button class="cancel-btn" @click="deleteQuest">삭제하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// API 기본 URL
const API_URL = "http://localhost:8080";

// 인증 스토어 가져오기
const authStore = useAuthStore();

export default {
    name: "QuestBrowsing",
    data() {
        return {
            selectedDifficulty: "all",
            selectedQuest: null,
            quests: [],
            pagination: {
                currentPage: 1,
                totalItems: 0,
                totalPages: 0,
                pageSize: 6,
            },
            loading: false,
            error: null,
        };
    },
    created() {
        // 컴포넌트가 생성될 때 퀘스트 데이터 로드
        this.fetchQuests();
    },
    computed: {},
    methods: {
        // 백엔드에서 퀘스트 데이터 가져오기
        fetchQuests() {
            this.loading = true;
            this.error = null;

            const token = authStore.accessToken;

            if (!token) {
                this.error = "로그인이 필요합니다.";
                this.loading = false;
                return;
            }

            axios
                .get(`${API_URL}/quests/me/created`, {
                    params: {
                        page: this.pagination.currentPage,
                        size: this.pagination.pageSize,
                        difficulty: this.selectedDifficulty === "all" ? null : this.selectedDifficulty,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    // 백엔드 응답 구조에 맞게 데이터 추출
                    const questsData = response.data.quests || [];
                    const paginationData = response.data.pagination || {};

                    // 퀘스트 데이터 변환 (백엔드 DTO 형식에 맞게 조정)
                    this.quests = questsData.map((quest) => ({
                        questId: quest.questId,
                        title: quest.questTitle,
                        attractionImage: quest.attractionImage,
                        attractionTitle: quest.attractionTitle,
                        contentTypeTitle: quest.contentTypeName,
                        sidoName: quest.attractionAddress,
                        difficulty: quest.questDifficulty,
                        description: quest.questDescription,
                    }));

                    // 페이지네이션 정보 업데이트
                    this.pagination = {
                        currentPage: paginationData.currentPage || 1,
                        totalItems: paginationData.totalItems || 0,
                        totalPages: paginationData.totalPages || 1,
                        pageSize: paginationData.pageSize || 6,
                    };

                    // 필터링 적용
                    // this.applyFilter();
                })
                .catch((error) => {
                    console.error("퀘스트 데이터를 불러오는 중 오류가 발생했습니다:", error);

                    if (error.response) {
                        // 서버 응답이 있는 경우
                        if (error.response.status === 401) {
                            this.error = "인증이 만료되었습니다. 다시 로그인해주세요.";
                            // 로그인 페이지로 리다이렉트 (필요시)
                            // this.$router.push("/login");
                        } else {
                            this.error = `오류가 발생했습니다: ${error.response.data.message || "알 수 없는 오류"}`;
                        }
                    } else {
                        this.error = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 페이지 변경 처리
        changePage(page) {
            this.pagination.currentPage = page;
            this.fetchQuests();
        },

        filterQuests(difficulty) {
            this.selectedDifficulty = difficulty;
            this.pagination.currentPage = 1;
            this.fetchQuests();
        },

        openDetailModal(quest) {
            this.selectedQuest = quest;
            document.body.style.overflow = "hidden"; // 모달 열릴 때 배경 스크롤 방지
        },

        closeDetailModal() {
            this.selectedQuest = null;
            document.body.style.overflow = ""; // 모달 닫힐 때 배경 스크롤 복원
        },

        updateQuest() {
            this.$router.push(`/modify-quest/${this.selectedQuest.questId}`);
            this.closeDetailModal();
        },
        deleteQuest() {
            if (!confirm(`"${this.selectedQuest.title}" 퀘스트를 정말 삭제하시겠습니까?`)) {
                return;
            }

            const token = authStore.accessToken;

            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            axios
                .patch(
                    `${API_URL}/quests/delete/${this.selectedQuest.questId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    // 성공 메시지 표시
                    alert(response.data.message || "퀘스트가 성공적으로 삭제되었습니다.");

                    // 모달 닫기
                    this.closeDetailModal();

                    // 퀘스트 목록 새로고침
                    this.fetchQuests();
                })
                .catch((error) => {
                    console.error("퀘스트 삭제 중 오류가 발생했습니다:", error);

                    let errorMessage = "퀘스트 삭제 중 오류가 발생했습니다.";

                    if (error.response) {
                        if (error.response.status === 401) {
                            errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
                        } else if (error.response.status === 403) {
                            errorMessage = "삭제 권한이 없습니다.";
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
                    this.loading = false;
                });

            this.closeDetailModal();
        },
    },
};
</script>

<style scoped>
/* 기본 스타일 및 리셋 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: "Noto Sans KR", sans-serif;
    color: #333;
    background-color: #fff;
}

/* 메인 컨텐츠 스타일 */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.title {
    text-align: center;
    color: #5a9bd8;
    font-size: 1.8rem;
    margin-top: 1rem;
}

.title-underline {
    width: 200px;
    height: 3px;
    background-color: #5a9bd8;
    margin: 0.5rem auto 1.5rem;
}

.description {
    text-align: center;
    color: #666;
    margin-bottom: 1.5rem;
}

/* 필터 버튼 스타일 */
.filter-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

.filter-btn {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 18px;
    padding: 0.5rem 1rem;
    margin: 0 0.3rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
}

.filter-btn.active {
    background-color: #5a9bd8;
    color: white;
    border-color: #5a9bd8;
}

.filter-btn:hover:not(.active) {
    background-color: #f8f9fa;
}

/* 퀘스트 그리드 스타일 */
.quest-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.quest-card {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s, box-shadow 0.3s;
}

.quest-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quest-image {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    background-color: #f8f9fa;
}

.circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 0.8rem;
    text-align: center;
    padding: 0.5rem;
}

.circle.large {
    width: 150px;
    height: 150px;
    font-size: 1rem;
}

.quest-info {
    padding: 1rem 1.5rem 1.5rem;
}

.quest-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    text-align: center;
}

.difficulty-badge {
    display: inline-block;
    width: 100%;
    padding: 0.3rem 0;
    text-align: center;
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    margin: 0.5rem 0 1rem;
    width: fit-content;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
}

.difficulty-badge.easy {
    background-color: #444;
}

.difficulty-badge.medium {
    background-color: #666;
}

.difficulty-badge.hard {
    background-color: #888;
}

.quest-tags {
    margin-bottom: 1rem;
}

.tag {
    color: #777;
    font-size: 0.9rem;
    display: block;
    margin-bottom: 0.3rem;
}

.detail-btn {
    background-color: #5a9bd8;
    color: white;
    border: none;
    border-radius: 18px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s;
}

.detail-btn:hover {
    background-color: #4a90e2;
}

/* 페이지네이션 스타일 */
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    gap: 0.5rem;
}

.pagination-btn {
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
}

.pagination-btn.active {
    background-color: #5a9bd8;
    color: white;
    border-color: #5a9bd8;
}

.pagination-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f8f9fa;
}

.pagination-btn:hover:not(:disabled):not(.active) {
    background-color: #f8f9fa;
    border-color: #5a9bd8;
}

/* 모달 스타일 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: #fff;
    border-radius: 10px;
    padding: 2rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}
.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
}
.modal-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #4a90e2;
}
.quest-detail-image {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}
.quest-detail-info {
    text-align: center;
}
.difficulty-badge {
    display: inline-block;
    padding: 0.3rem 1rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    margin: 1rem 0;
}
.difficulty-badge.easy {
    background-color: #28a745;
}
.difficulty-badge.medium {
    background-color: #fd7e14;
}
.difficulty-badge.hard {
    background-color: #dc3545;
}
.quest-description {
    margin-bottom: 0.5rem;
    text-align: left;
    line-height: 1.6;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.start-btn {
    background-color: #5a9bd8;
    color: white;
    border: none;
    border-radius: 18px;
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
}

.start-btn:hover {
    background-color: #4a90e2;
}

.cancel-btn {
    background-color: #f1f1f1;
    color: #666;
    border: none;
    border-radius: 18px;
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cancel-btn:hover {
    background-color: #e0e0e0;
}

/* 반응형 스타일 */
@media (max-width: 960px) {
    .quest-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        padding: 1rem;
    }

    .logo {
        margin-bottom: 1rem;
    }

    .navigation ul {
        flex-wrap: wrap;
        justify-content: center;
    }

    .nav-item {
        margin: 0.5rem;
    }

    .profile {
        margin-top: 1rem;
    }

    .quest-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .filter-buttons {
        flex-wrap: wrap;
    }

    .filter-btn {
        margin: 0.3rem;
    }
}

@media (max-width: 480px) {
    .quest-grid {
        grid-template-columns: 1fr;
    }

    .title {
        font-size: 1.5rem;
    }

    .modal-content {
        width: 95%;
        padding: 1.5rem;
    }

    .description {
        font-size: 0.9rem;
    }
}
</style>
