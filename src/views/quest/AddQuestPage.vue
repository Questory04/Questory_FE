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
                <label class="form-label">퀘스트 설명</label>
                <textarea
                    class="form-textarea"
                    placeholder="퀘스트에 대한 설명을 입력하세요"
                    v-model="formData.questDescription"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">스탬프 설명</label>
                <textarea
                    class="form-textarea"
                    placeholder="스탬프에 대한 설명을 입력하세요"
                    v-model="formData.stampDescription"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">공개 여부</label>
                <div class="radio-group">
                    <label
                        v-for="(option, index) in isPrivate"
                        :key="index"
                        :class="['radio-option', formData.isPrivate === option.value ? 'active' : 'inactive']"
                        @click="formData.isPrivate = option.value"
                    >
                        <input type="radio" name="isPrivate" :value="option.value" v-model="formData.isPrivate" />
                        {{ option.label }}
                    </label>
                </div>
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>

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
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// API 기본 URL
const API_URL = "http://localhost:8080";

// 인증 스토어 가져오기
const authStore = useAuthStore();

export default {
    name: "QuestRegistration",
    data() {
        return {
            pageTitle: "퀘스트 등록하기",
            menuItems: ["퀘스트", "여행", "커뮤니티", "친구", "스탬프"],
            difficultyOptions: ["EASY", "MEDIUM", "HARD"],
            isPrivate: [
                { value: false, label: "공개" },
                { value: true, label: "비공개" },
            ],
            formData: {
                location: "",
                attractionId: null, // 선택된 관광지의 ID (백엔드 DTO에 맞게 변경)
                title: "",
                difficulty: "EASY",
                questDescription: "", // 백엔드 DTO에 맞게 변경
                stampDescription: "",
                isPrivate: false, // 백엔드 DTO에 맞게 변경
            },
            // 검색 모달 관련 상태
            showSearchModal: false,
            searchKeyword: "",
            searchResults: [],
            searchPerformed: false,
            searchLoading: false,
            searchError: null,
            // 폼 제출 관련 상태
            loading: false,
            error: null,
        };
    },
    methods: {
        // 관광지 검색 모달 열기
        searchLocation() {
            this.showSearchModal = true;
            this.searchKeyword = this.formData.location;
            this.searchResults = [];
            this.searchPerformed = false;
            this.searchError = null;

            if (this.searchKeyword.trim()) {
                this.performSearch();
            }
        },

        // 관광지 검색 실행
        async performSearch() {
            if (!this.searchKeyword.trim()) {
                this.searchError = "검색어를 입력해주세요.";
                return;
            }

            this.searchLoading = true;
            this.searchError = null;
            this.searchPerformed = true;

            try {
                const response = await axios.get(`${API_URL}/attractions/search-attractions`, {
                    params: {
                        searchKeyword: this.searchKeyword,
                    },
                });

                // 백엔드 응답 형식에 맞게 조정 (attractions 배열 추출)
                this.searchResults = response.data.attractions || [];
            } catch (error) {
                console.error("관광지 검색 중 오류가 발생했습니다:", error);

                if (error.response) {
                    if (error.response.status === 400) {
                        this.searchError = "잘못된 검색어입니다.";
                    } else if (error.response.status === 500) {
                        this.searchError = "서버 오류가 발생했습니다.";
                    } else {
                        this.searchError = `검색 오류: ${error.response.data.message || "알 수 없는 오류"}`;
                    }
                } else {
                    this.searchError = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
                }
            } finally {
                this.searchLoading = false;
            }
        },

        // 관광지 선택
        selectLocation(attraction) {
            this.formData.location = attraction.name; // 관광지명은 title 필드 사용
            this.formData.attractionId = attraction.attractionId; // 백엔드 DTO에 맞게 변경
            this.closeSearchModal();
        },

        // 검색 모달 닫기
        closeSearchModal() {
            this.showSearchModal = false;
            this.searchResults = [];
            this.searchPerformed = false;
            this.searchError = null;
        },

        // 폼 제출
        async submitForm() {
            // 입력 값 검증
            if (!this.formData.location.trim()) {
                this.error = "관광지를 입력해주세요";
                alert("관광지를 입력해주세요");
                return;
            }

            if (!this.formData.title.trim()) {
                this.error = "퀘스트 제목을 입력해주세요";
                alert("퀘스트 제목을 입력해주세요");
                return;
            }

            if (!this.formData.questDescription.trim()) {
                this.error = "퀘스트 설명을 입력해주세요";
                alert("퀘스트 설명을 입력해주세요");
                return;
            }

            if (!this.formData.stampDescription.trim()) {
                this.error = "스탬프 설명을 입력해주세요";
                alert("스탬프 설명을 입력해주세요");
                return;
            }

            this.loading = true;
            this.error = null;

            const token = authStore.accessToken;

            if (!token) {
                this.error = "로그인이 필요합니다.";
                this.loading = false;
                return;
            }

            // 백엔드로 전송할 데이터 구성 (QuestRequestDto에 맞게)
            const submitData = {
                attraction_id: this.formData.attractionId, // snake_case로 변환
                title: this.formData.title,
                quest_description: this.formData.questDescription, // snake_case로 변환
                difficulty: this.formData.difficulty,
                is_private: this.formData.isPrivate, // snake_case로 변환
                stamp_description: this.formData.stampDescription, // snake_case로 변환
            };

            try {
                const response = await axios.post(`${API_URL}/quests`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // 성공 처리 - 백엔드 응답 메시지 사용
                const successMessage = response.data.message || "퀘스트가 성공적으로 등록되었습니다!";
                alert(successMessage);
                this.resetForm();

                // 퀘스트 목록 페이지로 이동 (선택사항)
                this.$router.push("/quests");
            } catch (error) {
                console.error("퀘스트 등록 중 오류가 발생했습니다:", error);

                if (error.response) {
                    if (error.response.status === 401) {
                        this.error = "인증이 만료되었습니다. 다시 로그인해주세요.";
                    } else if (error.response.status === 400) {
                        this.error = `입력 오류: ${error.response.data.message || "잘못된 입력값입니다."}`;
                    } else {
                        this.error = `등록 오류: ${error.response.data.message || "알 수 없는 오류"}`;
                    }
                } else {
                    this.error = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
                }
            } finally {
                this.loading = false;
            }
        },

        // 폼 초기화
        resetForm() {
            this.formData = {
                location: "",
                attractionId: null,
                title: "",
                difficulty: "EASY",
                questDescription: "",
                stampDescription: "",
                isPrivate: false,
            };
            this.error = null;
        },

        // 에러 메시지 지우기
        clearError() {
            this.error = null;
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

.form-error {
    color: red;
    font-size: 0.9rem;
    margin-top: -1rem;
    margin-bottom: 1rem;
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
