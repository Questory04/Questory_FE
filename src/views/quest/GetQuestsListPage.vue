<template>
    <div class="quest-browsing-page">
        <!-- 헤더 영역 -->
        <!-- <header class="header">
            <div class="logo">Questory</div>
            <nav class="navigation">
                <ul>
                    <li class="nav-item active">퀘스트</li>
                    <li class="nav-item">여행</li>
                    <li class="nav-item">커뮤니티</li>
                    <li class="nav-item">친구</li>
                    <li class="nav-item">스탬프</li>
                </ul>
            </nav>
            <div class="profile">
                <div class="profile-circle"></div>
            </div>
        </header> -->

        <!-- 메인 컨텐츠 영역 -->
        <main class="main-content">
            <h2 class="title">퀘스트 조회</h2>
            <div class="title-underline"></div>

            <p class="description">여러가지 퀘스트를 확인해보세요!</p>

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
                <div v-for="quest in filteredQuests" :key="quest.id" class="quest-card">
                    <div class="quest-image">
                        <div class="circle">
                            <span>{{ quest.attractionImage }}</span>
                        </div>
                    </div>
                    <div class="quest-info">
                        <h3 class="quest-title">{{ quest.title }}</h3>
                        <div class="difficulty-badge" :class="quest.difficulty.toLowerCase()">
                            {{ quest.difficulty }}
                        </div>
                        <div class="quest-tags">
                            <span class="tag">{{ quest.contentTypeTitle }}</span>
                            <span class="tag">{{ quest.sidoName }}</span>
                        </div>
                        <button class="detail-btn" @click="openDetailModal(quest)">상세보기</button>
                    </div>
                </div>
            </div>
        </main>

        <!-- 상세 정보 모달 -->
        <div class="modal-overlay" v-if="selectedQuest" @click.self="closeDetailModal">
            <div class="modal-content">
                <button class="close-btn" @click="closeDetailModal">×</button>
                <h3 class="modal-title">{{ selectedQuest.title }}</h3>
                <div class="quest-detail-image">
                    <div class="circle large">
                        <span>{{ selectedQuest.attractionImage }}</span>
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
                        <button class="start-btn" @click="startQuest">시작하기</button>
                        <button class="cancel-btn" @click="closeDetailModal">취소</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestBrowsing",
    data() {
        return {
            selectedDifficulty: "all",
            selectedQuest: null,
            quests: [
                {
                    id: 1,
                    title: "퀘스트 이름",
                    attractionTitle: "관광지 이름",
                    attractionImage: "image.png",
                    contentTypeTitle: "관광지 타입",
                    sidoName: "시도",
                    difficulty: "EASY",
                    description: "이 퀘스트는 관광지 탐험을 통해 완료할 수 있는 퀘스트입니다.",
                },
                {
                    id: 2,
                    title: "남산타워 가자",
                    attractionTitle: "남산타워",
                    attractionImage: "관광지 이미지",
                    contentTypeTitle: "관광지 타입",
                    sidoName: "시도",
                    difficulty: "HARD",
                    description: "서울 남산타워를 방문하고 퀘스트를 완료해보세요.",
                },
                {
                    id: 3,
                    title: "퀘스트 이름",
                    attractionTitle: "관광지 이름",
                    attractionImage: "image.png",
                    contentTypeTitle: "관광지 타입",
                    sidoName: "시도",
                    difficulty: "MEDIUM",
                    description: "이 퀘스트는 관광지 탐험을 통해 완료할 수 있는 퀘스트입니다.",
                },
                {
                    id: 4,
                    title: "퀘스트 이름",
                    attractionTitle: "관광지 이름",
                    attractionImage: "image.png",
                    contentTypeTitle: "관광지 타입",
                    sidoName: "시도",
                    difficulty: "EASY",
                    description: "이 퀘스트는 관광지 탐험을 통해 완료할 수 있는 퀘스트입니다.",
                },
                {
                    id: 5,
                    title: "퀘스트 이름",
                    attractionTitle: "관광지 이름",
                    attractionImage: "image.png",
                    contentTypeTitle: "관광지 타입",
                    sidoName: "시도",
                    difficulty: "EASY",
                    description: "이 퀘스트는 관광지 탐험을 통해 완료할 수 있는 퀘스트입니다.",
                },
                {
                    id: 6,
                    title: "퀘스트 이름",
                    attractionTitle: "관광지 이름",
                    attractionImage: "image.png",
                    contentTypeTitle: "관광지 타입",
                    sidoName: "시도",
                    difficulty: "EASY",
                    description: "이 퀘스트는 관광지 탐험을 통해 완료할 수 있는 퀘스트입니다.",
                },
            ],
        };
    },
    computed: {
        filteredQuests() {
            if (this.selectedDifficulty === "all") {
                return this.quests;
            }
            return this.quests.filter((quest) => quest.difficulty === this.selectedDifficulty);
        },
    },
    methods: {
        filterQuests(difficulty) {
            this.selectedDifficulty = difficulty;
        },
        openDetailModal(quest) {
            this.selectedQuest = quest;
            document.body.style.overflow = "hidden"; // 모달 열릴 때 배경 스크롤 방지
        },
        closeDetailModal() {
            this.selectedQuest = null;
            document.body.style.overflow = ""; // 모달 닫힐 때 배경 스크롤 복원
        },
        startQuest() {
            // 퀘스트 시작 로직 구현
            console.log("퀘스트 시작:", this.selectedQuest);
            // 실제 구현 시에는 퀘스트 시작 페이지로 이동하거나
            // 필요한 API 호출 등을 수행할 수 있습니다.
            // this.$router.push({ name: 'quest-play', params: { id: this.selectedQuest.id } });

            // 모달 닫기
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

/* 헤더 스타일 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: #5a9bd8;
}

.navigation ul {
    display: flex;
    list-style: none;
}

.nav-item {
    margin: 0 1rem;
    padding: 0.5rem 0;
    cursor: pointer;
    color: #666;
    font-weight: 500;
}

.nav-item.active {
    color: #333;
    border-bottom: 2px solid #5a9bd8;
}

.profile-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e0e0e0;
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
