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
export default {
    name: "QuestEdit",
    data() {
        return {
            pageTitle: "퀘스트 수정하기",
            menuItems: ["퀘스트", "여행", "커뮤니티", "친구", "스탬프"],
            difficultyOptions: ["EASY", "MEDIUM", "HARD"],
            visibilityOptions: [
                { value: "public", label: "공개" },
                { value: "private", label: "비공개" },
            ],
            formData: {
                id: 2,
                location: "서울 남산타워",
                address: "서울특별시 용산구 남산공원길 105",
                title: "남산타워 가자",
                difficulty: "MEDIUM",
                description: "서울의 랜드마크 ! 남산타워에서 가보세요 ~",
                stampDescription:
                    "서울 남산타워를 방문하고 퀘스트를 완료하여 획득한 스탬프입니다. 남산타워에서 서울 전경을 구경했습니다.",
                visibility: "public",
            },
            originalData: null,
            showConfirmModal: false,
        };
    },
    created() {
        // 실제 구현 시: API에서 퀘스트 데이터 불러오기
        // const questId = this.$route.params.id;
        // axios.get(`/api/quests/${questId}`)
        //     .then(response => {
        //         this.formData = response.data;
        //         this.originalData = JSON.parse(JSON.stringify(response.data));
        //     })
        //     .catch(error => {
        //         console.error('퀘스트 불러오기 오류:', error);
        //     });

        // 현재는 더미 데이터 저장
        this.originalData = JSON.parse(JSON.stringify(this.formData));
    },
    methods: {
        submitForm() {
            // 입력 검증
            if (!this.formData.title.trim()) {
                alert("퀘스트 제목을 입력해주세요");
                return;
            }

            if (!this.formData.description.trim()) {
                alert("퀘스트 설명을 입력해주세요");
                return;
            }

            if (!this.formData.stampDescription.trim()) {
                alert("퀘스트 설명을 입력해주세요");
                return;
            }

            // 실제 구현 시: API 호출
            // axios.put(`/api/quests/${this.formData.id}`, this.formData)
            //     .then(response => {
            //         alert('퀘스트가 성공적으로 수정되었습니다!');
            //         this.$router.push('/quests');
            //     })
            //     .catch(error => {
            //         console.error('수정 오류:', error);
            //     });

            // 현재는 성공 메시지만 표시
            console.log("수정된 퀘스트 데이터:", this.formData);
            alert("퀘스트가 성공적으로 수정되었습니다!");
            // 실제 구현 시: 목록 페이지로 이동
            // this.$router.push('/quests');
        },
        cancelEdit() {
            // 변경사항이 있는지 확인
            if (JSON.stringify(this.formData) !== JSON.stringify(this.originalData)) {
                this.showConfirmModal = true;
            } else {
                this.goBack();
            }
        },
        closeConfirmModal() {
            this.showConfirmModal = false;
        },
        confirmCancel() {
            this.closeConfirmModal();
            this.goBack();
        },
        goBack() {
            // 실제 구현 시: 이전 페이지로 이동
            // this.$router.go(-1);

            // 현재는 알림만 표시
            alert("퀘스트 수정이 취소되었습니다.");
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
