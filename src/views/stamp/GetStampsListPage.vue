<template>
    <div class="stamp-collection-page">
        <!-- 메인 컨텐츠 영역 -->
        <main class="main-content">
            <h2 class="title">나의 스탬프 컬렉션</h2>
            <div class="title-underline"></div>

            <p class="description">퀘스트를 완료하여 얻은 스탬프들을 확인해보세요!</p>

            <!-- 필터 버튼 -->
            <div class="filter-buttons">
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'all' }"
                    @click="filterStamps('all')"
                >
                    전체
                </button>
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'EASY' }"
                    @click="filterStamps('EASY')"
                >
                    EASY
                </button>
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'MEDIUM' }"
                    @click="filterStamps('MEDIUM')"
                >
                    MEDIUM
                </button>
                <button
                    class="filter-btn"
                    :class="{ active: selectedDifficulty === 'HARD' }"
                    @click="filterStamps('HARD')"
                >
                    HARD
                </button>
            </div>

            <!-- 스탬프 카드 그리드 -->
            <div class="stamp-grid">
                <div v-for="stamp in filteredStamps" :key="stamp.id" class="stamp-card">
                    <div class="stamp-image">
                        <div class="circle">
                            <span>{{ stamp.url }}</span>
                        </div>
                    </div>
                    <div class="stamp-info">
                        <h3 class="stamp-title">{{ stamp.title }}</h3>
                        <div class="stamp-date">{{ stamp.date }}</div>
                        <div class="stamp-tags">
                            <span class="tag">{{ stamp.contentTypeTitle }}</span>
                            <span class="tag">{{ stamp.sidoName }}</span>
                        </div>
                        <button class="detail-btn" @click="openDetailModal(stamp)">상세보기</button>
                    </div>
                </div>
            </div>
        </main>

        <!-- 상세 정보 모달 -->
        <div class="modal-overlay" v-if="selectedStamp" @click.self="closeDetailModal">
            <div class="modal-content">
                <button class="close-btn" @click="closeDetailModal">×</button>
                <h3 class="modal-title">{{ selectedStamp.title }}</h3>
                <div class="stamp-detail-image">
                    <div class="circle large">
                        <span>{{ selectedStamp.imageName }}</span>
                    </div>
                </div>
                <div class="stamp-detail-info">
                    <p class="stamp-date">획득 날짜: {{ selectedStamp.date }}</p>
                    <div class="stamp-tags">
                        <span class="tag">{{ selectedStamp.contentTypeTitle }}</span>
                        <span class="tag">{{ selectedStamp.sidoName }}</span>
                    </div>
                    <div class="difficulty-badge" :class="selectedStamp.difficulty.toLowerCase()">
                        {{ selectedStamp.difficulty }}
                    </div>
                    <p class="stamp-description">
                        {{
                            selectedStamp.description ||
                            "이 스탬프는 특별한 퀘스트를 완료하여 획득한 기념 스탬프입니다."
                        }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StampCollection",
    data() {
        return {
            selectedDifficulty: "all",
            selectedStamp: null,
            stamps: [
                {
                    id: 1,
                    title: "퀘스트 이름",
                    url: "스탬프 이미지",
                    date: "20XX.XX.XX",
                    contentTypeTitle: "# 관광지 타입",
                    sidoName: "# 시도",
                    difficulty: "EASY",
                    description: "이 스탬프는 관광지 탐험 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
                {
                    id: 2,
                    title: "남산타워 가자",
                    url: "남산타워 스탬프 이미지",
                    date: "2025.05.05",
                    contentTypeTitle: "# 관광지",
                    sidoName: "# 서울시",
                    difficulty: "MEDIUM",
                    description:
                        "서울 남산타워를 방문하고 퀘스트를 완료하여 획득한 스탬프입니다. 남산타워에서 서울 전경을 구경했습니다.",
                },
                {
                    id: 3,
                    title: "송현아 쇼핑",
                    url: "송도 스탬프",
                    date: "2025.07.20",
                    contentTypeTitle: "# 쇼핑",
                    sidoName: "# 인천시",
                    difficulty: "HARD",
                    description: "인천 송도에서 쇼핑 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
                {
                    id: 4,
                    title: "한강 피크닉",
                    url: "스탬프 이미지",
                    date: "2025.06.10",
                    contentTypeTitle: "# 레저",
                    sidoName: "# 서울시",
                    difficulty: "EASY",
                    description: "한강에서 피크닉 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
                {
                    id: 5,
                    title: "경복궁 탐방",
                    url: "남산타워 스탬프 이미지",
                    date: "2025.04.15",
                    contentTypeTitle: "# 관광지",
                    sidoName: "# 서울시",
                    difficulty: "MEDIUM",
                    description: "경복궁을 탐방하고 역사 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
                {
                    id: 6,
                    title: "부산 해운대 여행",
                    url: "송도 스탬프",
                    date: "2025.08.01",
                    contentTypeTitle: "# 관광지",
                    sidoName: "# 부산시",
                    difficulty: "HARD",
                    description: "부산 해운대에서 바다 관련 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
                {
                    id: 7,
                    title: "부산 해운대 여행",
                    url: "송도 스탬프",
                    date: "2025.08.01",
                    contentTypeTitle: "# 관광지",
                    sidoName: "# 부산시",
                    difficulty: "HARD",
                    description: "부산 해운대에서 바다 관련 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
                {
                    id: 8,
                    title: "부산 해운대 여행",
                    url: "송도 스탬프",
                    date: "2025.08.01",
                    contentTypeTitle: "# 관광지",
                    sidoName: "# 부산시",
                    difficulty: "HARD",
                    description: "부산 해운대에서 바다 관련 퀘스트를 완료하여 획득한 스탬프입니다.",
                },
            ],
        };
    },
    computed: {
        filteredStamps() {
            if (this.selectedDifficulty === "all") {
                return this.stamps;
            }
            return this.stamps.filter((stamp) => stamp.difficulty === this.selectedDifficulty);
        },
    },
    methods: {
        filterStamps(difficulty) {
            this.selectedDifficulty = difficulty;
        },
        openDetailModal(stamp) {
            this.selectedStamp = stamp;
            document.body.style.overflow = "hidden"; // 모달 열릴 때 배경 스크롤 방지
        },
        closeDetailModal() {
            this.selectedStamp = null;
            document.body.style.overflow = ""; // 모달 닫힐 때 배경 스크롤 복원
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
    color: #4a90e2;
    font-size: 1.8rem;
    margin-top: 1rem;
}

.title-underline {
    width: 200px;
    height: 3px;
    background-color: #4a90e2;
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
    background-color: #4a90e2;
    color: white;
    border-color: #4a90e2;
}

.filter-btn:hover:not(.active) {
    background-color: #f8f9fa;
}

/* 스탬프 그리드 스타일 */
.stamp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.stamp-card {
    background-color: #f8f9fa;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s, box-shadow 0.3s;
}

.stamp-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stamp-image {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
}

.circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #f0f0f0;
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

.stamp-info {
    padding: 1rem 1.5rem 1.5rem;
}

.stamp-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    text-align: center;
}

.stamp-date {
    background-color: #666;
    color: white;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    text-align: center;
    font-size: 0.8rem;
    margin-bottom: 1rem;
    width: fit-content;
    /* min-width: 80px; */
    box-sizing: border-box;
    margin-left: auto;
}

.stamp-tags {
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
    border-radius: 15px;
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

.stamp-detail-image {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.stamp-detail-info {
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

.stamp-description {
    margin-bottom: 0.5rem;
    text-align: left;
    line-height: 1.6;
}

/* 반응형 스타일 */
@media (max-width: 960px) {
    .stamp-grid {
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

    .navigation li {
        margin: 0.5rem;
    }

    .profile {
        margin-top: 1rem;
    }

    .stamp-grid {
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
    .stamp-grid {
        grid-template-columns: 1fr;
    }

    .modal-content {
        width: 95%;
        padding: 1.5rem;
    }

    .title {
        font-size: 1.5rem;
    }

    .description {
        font-size: 0.9rem;
    }
}
</style>
