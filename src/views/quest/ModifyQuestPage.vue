<template>
    <div class="container">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="title-underline"></div>

        <form class="quest-form" @submit.prevent="submitForm">
            <div class="form-group">
                <label class="form-label">관광지</label>
                <div class="location-readonly">
                    <h4 class="location-name">{{ formData.location }}</h4>
                    <p class="location-address">{{ formData.address }}</p>
                    <span class="readonly-badge">수정 불가</span>
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
                    v-model="formData.description"
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
                <button type="submit" class="btn btn-primary">수정</button>
                <button type="button" class="btn btn-secondary" @click="cancelEdit">취소</button>
            </div>
        </form>

        <!-- 취소 확인 모달 -->
        <div class="modal-overlay" v-if="showConfirmModal" @click.self="closeConfirmModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">정말 취소하시겠습니까?</h3>
                    <button class="modal-close" @click="closeConfirmModal">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message">수정 중인 내용이 저장되지 않습니다.</p>
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" @click="closeConfirmModal">계속 수정</button>
                        <button class="btn btn-primary" @click="confirmCancel">확인</button>
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
    name: "QuestEdit",
    data() {
        return {
            pageTitle: "퀘스트 수정하기",
            menuItems: ["퀘스트", "여행", "커뮤니티", "친구", "스탬프"],
            difficultyOptions: ["EASY", "MEDIUM", "HARD"],
            visibilityOptions: [
                { value: false, label: "공개" },
                { value: true, label: "비공개" },
            ],
            formData: {
                id: null,
                attractionId: null,
                location: "",
                address: "",
                title: "",
                difficulty: "EASY",
                questDescription: "",
                stampDescription: "",
                visibility: false,
            },
            originalData: null,
            showConfirmModal: false,
            // 상태 관리
            loading: false,
            submitting: false,
            error: null,
            questId: null,
        };
    },
    async created() {
        // URL 파라미터에서 퀘스트 ID 가져오기
        this.questId = this.$route.params.questId;

        if (!this.questId) {
            this.error = "퀘스트 ID가 없습니다.";
            return;
        }

        // 퀘스트 데이터 로드
        await this.fetchQuestData();
    },
    methods: {
        // 백엔드에서 퀘스트 데이터 가져오기
        async fetchQuestData() {
            this.loading = true;
            this.error = null;

            const token = authStore.accessToken;

            if (!token) {
                this.error = "로그인이 필요합니다.";
                this.loading = false;
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/quests/${this.questId}`, {
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    // },
                });

                // 백엔드 응답 데이터를 폼 데이터로 변환
                const questData = response.data.quest;
                this.formData = {
                    attractionId: questData.attractionId,
                    location: questData.attractionName,
                    address: questData.attractionAddr,
                    title: questData.questTitle,
                    difficulty: questData.questDifficulty,
                    description: questData.questDescription,
                    stampDescription: questData.stampDescription,
                    visibility: questData.private,
                };

                // 원본 데이터 저장 (변경사항 감지용)
                this.originalData = JSON.parse(JSON.stringify(this.formData));
            } catch (error) {
                console.error("퀘스트 데이터를 불러오는 중 오류가 발생했습니다:", error);

                if (error.response) {
                    if (error.response.status === 401) {
                        this.error = "인증이 만료되었습니다. 다시 로그인해주세요.";
                    } else if (error.response.status === 404) {
                        this.error = "존재하지 않는 퀘스트입니다.";
                    } else if (error.response.status === 403) {
                        this.error = "이 퀘스트를 수정할 권한이 없습니다.";
                    } else {
                        this.error = `오류가 발생했습니다: ${error.response.data.message || "알 수 없는 오류"}`;
                    }
                } else {
                    this.error = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
                }
            } finally {
                this.loading = false;
            }
        },

        // 폼 제출 (퀘스트 수정)
        async submitForm() {
            // 입력 검증
            if (!this.formData.title.trim()) {
                this.error = "퀘스트 제목을 입력해주세요.";
                return;
            }

            if (!this.formData.description.trim()) {
                this.error = "퀘스트 설명을 입력해주세요.";
                return;
            }

            if (!this.formData.stampDescription.trim()) {
                this.error = "스탬프 설명을 입력해주세요.";
                return;
            }

            this.submitting = true;
            this.error = null;

            const token = authStore.accessToken;

            if (!token) {
                this.error = "로그인이 필요합니다.";
                this.submitting = false;
                return;
            }

            // 백엔드로 전송할 데이터 구성 (snake_case)
            const updateData = {
                attraction_id: this.formData.attractionId,
                title: this.formData.title,
                quest_description: this.formData.description,
                difficulty: this.formData.difficulty,
                is_private: this.formData.visibility,
                stamp_description: this.formData.stampDescription,
            };

            console.log("updateData : ", updateData);

            try {
                const response = await axios.patch(`${API_URL}/quests/${this.questId}`, updateData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // 성공 처리 - 백엔드 응답 메시지 사용
                const successMessage = response.data.message || "퀘스트가 성공적으로 수정되었습니다!";
                alert(successMessage);

                // 퀘스트 목록으로 이동
                this.$router.push("/quests");
            } catch (error) {
                console.error("퀘스트 수정 중 오류가 발생했습니다:", error);

                if (error.response) {
                    if (error.response.status === 401) {
                        this.error = "인증이 만료되었습니다. 다시 로그인해주세요.";
                    } else if (error.response.status === 403) {
                        this.error = "이 퀘스트를 수정할 권한이 없습니다.";
                    } else if (error.response.status === 400) {
                        this.error = `입력 오류: ${error.response.data.message || "잘못된 입력값입니다."}`;
                    } else {
                        this.error = `수정 오류: ${error.response.data.message || "알 수 없는 오류"}`;
                    }
                } else {
                    this.error = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
                }
            } finally {
                this.submitting = false;
            }
        },

        // 수정 취소
        cancelEdit() {
            // 변경사항이 있는지 확인
            if (this.hasChanges()) {
                this.showConfirmModal = true;
            } else {
                this.goBack();
            }
        },

        // 변경사항 감지
        hasChanges() {
            if (!this.originalData) return false;
            return JSON.stringify(this.formData) !== JSON.stringify(this.originalData);
        },

        // 확인 모달 닫기
        closeConfirmModal() {
            this.showConfirmModal = false;
        },

        // 취소 확인
        confirmCancel() {
            this.closeConfirmModal();
            this.goBack();
        },

        // 이전 페이지로 이동
        goBack() {
            // 퀘스트 상세 페이지로 이동 (또는 이전 페이지)
            this.$router.push(`/quests/${this.questId}`);
            // 또는 이전 페이지로: this.$router.go(-1);
        },

        // 에러 메시지 지우기
        clearError() {
            this.error = null;
        },

        // 날짜 형식 변환 (필요시 사용)
        formatDate(dateString) {
            if (!dateString) return "";

            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return `${year}.${month}.${day}`;
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

/* 관광지 정보 스타일 (수정 불가) */
.location-readonly {
    width: 100%;
    padding: 0.75rem;
    border: 0.0625rem solid #dee2e6;
    border-radius: 0.25rem;
    background-color: #f8f9fa;
    position: relative;
}

.location-name {
    font-size: 1rem;
    margin-bottom: 0.3125rem;
    font-weight: normal;
    color: #333;
}

.location-address {
    font-size: 0.875rem;
    color: #6c757d;
    margin: 0;
}

.readonly-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background-color: #e9ecef;
    color: #6c757d;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 1rem;
}

/* 버튼 영역 */
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

.modal-body {
    padding-bottom: 0.625rem;
}

.confirm-message {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #6c757d;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 0.9375rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.625rem;
    }
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
}
</style>
