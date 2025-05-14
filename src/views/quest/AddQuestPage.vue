<template>
    <div class="container">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="title-underline"></div>

        <form class="quest-form" @submit.prevent="submitForm">
            <div class="form-group">
                <label class="form-label">관광지</label>
                <div class="search-container">
                    <input
                        type="text"
                        class="form-input"
                        placeholder="관광지를 입력하세요"
                        v-model="formData.location"
                    />
                    <button type="button" class="btn-search" @click="searchLocation">검색</button>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">퀘스트 제목</label>
                <input type="text" class="form-input" placeholder="퀘스트 제목을 입력하세요" v-model="formData.title" />
            </div>

            <div class="form-group">
                <label class="form-label">난이도</label>
                <div class="radio-group">
                    <label
                        v-for="(option, index) in difficultyOptions"
                        :key="index"
                        :class="['radio-option', formData.difficulty === option ? 'active' : 'inactive']"
                        @click="formData.difficulty = option"
                    >
                        <input type="radio" name="difficulty" :value="option" v-model="formData.difficulty" />
                        {{ option }}
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">설명</label>
                <textarea
                    class="form-textarea"
                    placeholder="퀘스트에 대한 설명을 입력하세요"
                    v-model="formData.description"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">공개 여부</label>
                <div class="radio-group">
                    <label
                        v-for="(option, index) in visibilityOptions"
                        :key="index"
                        :class="['radio-option', formData.visibility === option.value ? 'active' : 'inactive']"
                        @click="formData.visibility = option.value"
                    >
                        <input type="radio" name="visibility" :value="option.value" v-model="formData.visibility" />
                        {{ option.label }}
                    </label>
                </div>
            </div>

            <div class="button-group">
                <button type="submit" class="btn btn-primary">등록</button>
                <button type="button" class="btn btn-secondary" @click="resetForm">취소</button>
            </div>
        </form>

        <!-- 위치 검색 모달 -->
        <div class="modal-overlay" v-if="showSearchModal" @click.self="closeSearchModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">관광지 검색</h3>
                    <button class="modal-close" @click="closeSearchModal">&times;</button>
                </div>

                <div class="modal-search">
                    <div class="search-container modal-search-container">
                        <input
                            type="text"
                            class="form-input"
                            placeholder="검색어를 입력하세요"
                            v-model="searchKeyword"
                            @keyup.enter="performSearch"
                        />
                        <button type="button" class="btn-search" @click="performSearch">검색</button>
                    </div>
                </div>

                <div class="search-results" v-if="searchResults.length > 0">
                    <div
                        v-for="(result, index) in searchResults"
                        :key="index"
                        class="result-item"
                        @click="selectLocation(result)"
                    >
                        <h4 class="result-name">{{ result.name }}</h4>
                        <p class="result-address">{{ result.address }}</p>
                    </div>
                </div>

                <div class="no-results" v-else-if="searchPerformed">
                    <p>검색 결과가 없습니다.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestRegistration",
    data() {
        return {
            pageTitle: "퀘스트 등록하기",
            menuItems: ["퀘스트", "여행", "커뮤니티", "친구", "스탬프"],
            difficultyOptions: ["EASY", "MEDIUM", "HARD"],
            visibilityOptions: [
                { value: "public", label: "공개" },
                { value: "private", label: "비공개" },
            ],
            formData: {
                location: "",
                title: "",
                difficulty: "EASY",
                description: "",
                visibility: "public",
            },
            // 검색 모달 관련 상태
            showSearchModal: false,
            searchKeyword: "",
            searchResults: [],
            searchPerformed: false,
        };
    },
    methods: {
        searchLocation() {
            this.showSearchModal = true;
            this.searchKeyword = this.formData.location; // 현재 입력된 값을 검색어로 설정
            if (this.searchKeyword.trim()) {
                this.performSearch(); // 이미 값이 있으면 자동 검색
            }
        },
        performSearch() {
            // 검색어가 비어있으면 검색하지 않음
            if (!this.searchKeyword.trim()) {
                return;
            }

            this.searchPerformed = true;
            // 실제로는 API 호출로 대체될 부분
            // 예시 데이터
            this.searchResults = [
                { name: "서울 남산타워", address: "서울특별시 용산구 남산공원길 105" },
                { name: "경복궁", address: "서울특별시 종로구 사직로 161" },
                { name: "부산 해운대 해수욕장", address: "부산광역시 해운대구 해운대해변로 264" },
                { name: "제주 성산일출봉", address: "제주특별자치도 서귀포시 성산읍 일출로 284-12" },
                { name: "경주 불국사", address: "경상북도 경주시 불국로 385" },
            ].filter(
                (item) =>
                    item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                    item.address.toLowerCase().includes(this.searchKeyword.toLowerCase())
            );

            // 실제 API 연동 시 아래 코드로 대체
            // axios.get(`/api/locations?query=${this.searchKeyword}`)
            //   .then(response => {
            //     this.searchResults = response.data;
            //   })
            //   .catch(error => {
            //     console.error('검색 오류:', error);
            //   });
        },
        selectLocation(location) {
            this.formData.location = location.name;
            this.closeSearchModal();
        },
        closeSearchModal() {
            this.showSearchModal = false;
        },
        submitForm() {
            // 입력 값 검증
            if (!this.formData.location.trim()) {
                alert("관광지를 입력해주세요");
                return;
            }

            if (!this.formData.title.trim()) {
                alert("퀘스트 제목을 입력해주세요");
                return;
            }

            if (!this.formData.description.trim()) {
                alert("퀘스트 설명을 입력해주세요");
                return;
            }

            console.log("폼 제출됨:", this.formData);
            alert("퀘스트가 등록되었습니다!");
            // 실제 구현: axios를 이용한 API 호출
            // axios.post('/api/quests', this.formData)
            //   .then(response => {
            //     alert('퀘스트가 성공적으로 등록되었습니다!');
            //     this.resetForm();
            //   })
            //   .catch(error => {
            //     console.error('등록 오류:', error);
            //   });
        },
        resetForm() {
            this.formData = {
                location: "",
                title: "",
                difficulty: "EASY",
                description: "",
                visibility: "public",
            };
        },
    },
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
        "Helvetica Neue", sans-serif;
}

body {
    background-color: #f8f9fa;
}

.container {
    max-width: 100%;
    width: 50rem;
    margin: 0 auto;
    padding: 1.25rem;

    /* 반응형 디자인을 위한 미디어 쿼리 */
    @media (max-width: 850px) {
        width: 95%;
        padding: 0.9375rem;
    }

    @media (max-width: 480px) {
        width: 100%;
        padding: 0.625rem;
    }
}

.quest-form {
    background-color: #f8f9fa;
    padding: 0.3125rem 1.875rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.05);

    @media (max-width: 480px) {
        padding: 1.25rem 0.9375rem;
    }
}

.page-title {
    text-align: center;
    font-size: 1.5rem;
    color: #4a90e2;

    @media (max-width: 480px) {
        font-size: 1.25rem;
        margin-bottom: 1.25rem;
    }
}

.title-underline {
    width: 8.125rem;
    height: 0.1875rem;
    background-color: #4a90e2;
    margin: 0.5rem auto 1.5rem;
}

.btn-primary {
    background-color: #5a9bd8;
    color: white;
}

.btn-primary:hover {
    background-color: #4a90e2;
}

.btn-secondary {
    background-color: #e9ecef;
    color: #495057;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-label {
    display: block;
    margin-top: 1.875rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #343a40;
    font-size: 1.125rem;
    text-align: left;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 0.0625rem solid #dee2e6;
    border-radius: 0.25rem;
    font-size: 1rem;
    background-color: #f8f9fa;

    @media (max-width: 480px) {
        padding: 0.625rem;
        font-size: 0.875rem;
    }
}

.form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 0.0625rem solid #dee2e6;
    border-radius: 0.25rem;
    font-size: 1rem;
    resize: vertical;
    min-height: 6.25rem;
    background-color: #f8f9fa;

    @media (max-width: 480px) {
        padding: 0.625rem;
        font-size: 0.875rem;
        min-height: 5rem;
    }
}

.radio-group {
    display: flex;
    gap: 0.9375rem;
    flex-wrap: wrap;

    @media (max-width: 480px) {
        gap: 0.625rem;
    }
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 0.3125rem;
    padding: 0.5rem 0.9375rem;
    border-radius: 1.25rem;
    cursor: pointer;

    @media (max-width: 480px) {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
    }
}

.radio-option.active {
    background-color: #e3f2fd;
    color: #2196f3;
}

.radio-option.inactive {
    background-color: #f5f5f5;
    color: #757575;
}

.radio-group input[type="radio"] {
    width: 1.125rem;
    height: 1.125rem;
}

.search-container {
    display: flex;
    gap: 0.625rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.5rem;
    }
}

.btn-search {
    background-color: #5a9bd8;
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 0.25rem;
    cursor: pointer;
    white-space: nowrap;

    @media (max-width: 480px) {
        padding: 0.625rem;
        width: 100%;
    }
}

.btn-search:hover {
    background-color: #4a90e2;
}

.button-group {
    display: flex;
    gap: 0.9375rem;
    margin-top: 2rem;
    margin-bottom: 1.875rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.625rem;
    }
}

.btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    font-weight: 500;

    @media (max-width: 480px) {
        padding: 0.75rem 0;
        font-size: 0.875rem;
    }
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
    width: 90%;
    max-width: 30rem;
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.25rem;
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1);
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 0.625rem;
    border-bottom: 0.0625rem solid #e9ecef;
}

.modal-title {
    font-size: 1.25rem;
    color: #4a90e2;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
}

.modal-search {
    margin-bottom: 1.25rem;
}

.modal-search-container {
    margin-bottom: 0;
}

.search-results {
    max-height: 18.75rem;
    overflow-y: auto;
}

.result-item {
    padding: 0.9375rem;
    border-bottom: 0.0625rem solid #e9ecef;
    cursor: pointer;
    transition: background-color 0.2s;
}

.result-item:hover {
    background-color: #f1f8fe;
}

.result-item:last-child {
    border-bottom: none;
}

.result-name {
    font-size: 1rem;
    margin: 0 0 0.3125rem 0;
    color: #333;
}

.result-address {
    font-size: 0.875rem;
    margin: 0;
    color: #6c757d;
}

.no-results {
    padding: 1.875rem 0;
    text-align: center;
    color: #6c757d;
}

/* 모달 반응형 스타일 */
@media (max-width: 480px) {
    .modal-content {
        width: 95%;
        padding: 0.9375rem;
    }

    .modal-title {
        font-size: 1.125rem;
    }

    .result-item {
        padding: 0.75rem;
    }
}
</style>
