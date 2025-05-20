<template>
    <div class="edit-profile-page">
        <!-- 헤더 로고 -->
        <!-- <header class="header">
            <h1 class="logo">Questory</h1>
            <div class="profile-icon">
                <div class="avatar"></div>
            </div>
        </header> -->

        <!-- 본문 영역 -->
        <div class="content">
            <!-- 페이지 제목 -->
            <h2 class="page-title">회원 정보 수정</h2>

            <!-- 프로필 이미지 섹션 -->
            <div class="profile-image-section">
                <div class="profile-image">
                    <div class="profile-circle">
                        <img
                            v-if="previewImage"
                            :src="previewImage"
                            alt="Profile Preview"
                            class="preview-image"
                        />
                    </div>
                    <label for="profile-input" class="camera-button">
                        <span class="camera-icon"></span>
                        <input
                            type="file"
                            id="profile-input"
                            class="profile-input-hidden"
                            @change="onFileSelected"
                            accept="image/*"
                        />
                    </label>
                </div>
            </div>

            <!-- 폼 영역 -->
            <form @submit.prevent="saveProfile" class="edit-form">
                <!-- 닉네임 필드 -->
                <div class="form-group">
                    <label for="nickname">닉네임</label>
                    <div class="input-container">
                        <input
                            type="text"
                            id="nickname"
                            v-model="userInfo.nickname"
                            class="form-input"
                            placeholder="닉네임"
                        />
                        <div class="input-focus-indicator"></div>
                    </div>
                </div>

                <!-- 칭호 필드 -->
                <div class="form-group">
                    <label for="title">칭호</label>
                    <div class="input-container">
                        <select
                            id="title"
                            v-model="userInfo.titleId"
                            class="form-input"
                        >
                            <option disabled value="">칭호를 선택하세요</option>
                            <option
                                v-for="title in titleList"
                                :key="title.titleId"
                                :value="title.titleId"
                            >
                                {{ title.name }}
                            </option>
                        </select>
                        <div class="input-focus-indicator"></div>
                    </div>
                </div>

                <!-- 추천 모드 필드 -->
                <div class="form-group">
                    <label for="referralCode">추천 모드</label>
                    <div class="input-container">
                        <input
                            type="text"
                            id="referralCode"
                            v-model="userInfo.referralCode"
                            class="form-input"
                            placeholder="추천 모드"
                        />
                        <div class="input-focus-indicator"></div>
                    </div>
                </div>

                <!-- 버튼 영역 -->
                <div class="button-group">
                    <button type="submit" class="btn btn-save">
                        <span class="btn-text">저장</span>
                    </button>
                    <button
                        type="button"
                        class="btn btn-cancel"
                        @click="cancel"
                    >
                        <span class="btn-text">취소</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "EditProfilePage",
    data() {
        return {
            userInfo: {
                nickname: "",
                titleId: "", // 🔄 title이 아니라 titleId로 바꿈
                referralCode: "",
                profileImage: null,
            },
            previewImage: null,
            titleList: [], // [{ titleId: 3, name: '여행의 시작', ... }, ...]
        };
    },
    mounted() {
        this.fetchTitles(); // 🔥 페이지 진입 시 호출
    },
    methods: {
        fetchTitles() {
            axios
                .get("http://localhost:8080/title", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`,
                    },
                })
                .then((res) => {
                    this.titleList = res.data; // 예: ['용감한 모험가', '탐험가', '지식왕']
                })
                .catch((err) => {
                    console.error("칭호 목록 불러오기 실패:", err);
                });
        },
        onFileSelected(event) {
            const file = event.target.files[0];
            if (file) {
                this.userInfo.profileImage = file;
                this.createPreviewImage(file);
            }
        },
        createPreviewImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        saveProfile() {
            console.log("프로필 저장:", this.userInfo);

            const formData = new FormData();
            formData.append("nickname", this.userInfo.nickname);
            formData.append("titleId", this.userInfo.titleId);
            formData.append("referralCode", this.userInfo.referralCode);
            if (this.userInfo.profileImage) {
                formData.append("profileImage", this.userInfo.profileImage);
            }

            // 실제 저장 API 호출은 아래 주석 참고
            // axios.post('/api/user/profile', formData).then(...)

            this.$router.push("/mypage");
        },
        cancel() {
            if (
                this.userInfo.nickname ||
                this.userInfo.title ||
                this.userInfo.referralCode ||
                this.userInfo.profileImage
            ) {
                if (
                    confirm(
                        "변경 사항이 저장되지 않을 수 있습니다. 정말로 취소하시겠습니까?"
                    )
                ) {
                    this.$router.push("/mypage");
                }
            } else {
                this.$router.push("/mypage");
            }
        },
    },
};
</script>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* 전체 페이지 */
.edit-profile-page {
    width: 100%;
    min-height: 80vh;
    background-color: #ffffff;
    font-family: "Noto Sans KR", Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
}

/* 헤더 */
.header {
    width: 100%;
    max-width: 1200px;
    padding: 30px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
}

.logo {
    color: #7eb9e6;
    font-size: 32px;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.logo:hover {
    transform: scale(1.02);
    color: #6aaad9;
}

.profile-icon {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease;
}

.profile-icon:hover {
    transform: scale(1.05);
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

/* 콘텐츠 영역 */
.content {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 40px 60px;
    position: relative;
    margin-top: 50px;
}

.content::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        180deg,
        rgba(240, 249, 255, 0.2) 0%,
        rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    z-index: -1;
}

/* 페이지 제목 */
.page-title {
    color: #6aaad9;
    font-size: 28px;
    text-align: center;
    margin-bottom: 40px;
    font-weight: 600;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.page-title::after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #7eb9e6;
    border-radius: 3px;
}

/* 프로필 이미지 섹션 */
.profile-image-section {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
}

.profile-image {
    position: relative;
    width: 120px;
    height: 120px;
}

.profile-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #e6f0f9;
    border: 3px solid #d9e6f2;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
}

.profile-circle:hover {
    border-color: #7eb9e6;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.camera-button {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #7eb9e6;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    z-index: 2;
}

.camera-button:hover {
    transform: scale(1.1);
    background-color: #6aaad9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.camera-button:active {
    transform: scale(0.95);
}

.camera-icon {
    width: 18px;
    height: 18px;
    background-color: #ffffff;
    border-radius: 50%;
    position: relative;
}

.camera-icon::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: #5a99d6;
    border-radius: 50%;
}

.profile-input-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    overflow: hidden;
}

/* 폼 스타일 */
.edit-form {
    width: 100%;
    max-width: 650px;
}

.form-group {
    display: flex;
    margin-bottom: 28px;
    align-items: center;
}

.form-group label {
    width: 120px;
    font-size: 18px;
    color: #333333;
    text-align: left;
    font-weight: 500;
    transition: color 0.2s ease;
}

.input-container {
    flex: 1;
    position: relative;
}

.form-input {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f8f9fa;
    font-size: 18px;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #7eb9e6;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(126, 185, 230, 0.15);
}

.form-input:focus + .input-focus-indicator {
    transform: scaleX(1);
}

.input-focus-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #7eb9e6;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    border-radius: 1px;
}

.form-input::placeholder {
    color: #aaaaaa;
    opacity: 0.7;
}

.form-group:focus-within label {
    color: #5a99d6;
}

/* 버튼 영역 - 그라데이션 제거 */
.button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 50px;
    width: 100%;
}

.btn {
    position: relative;
    width: 200px;
    height: 52px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    overflow: hidden;
}

.btn-text {
    position: relative;
    z-index: 2;
}

.btn-save {
    background-color: #7eb9e6; /* 단일 색상으로 변경 */
    color: white;
    box-shadow: 0 2px 10px rgba(90, 153, 214, 0.2);
}

.btn-save:hover {
    transform: translateY(-3px);
    background-color: #6aaad9; /* 호버 색상 변경 */
    box-shadow: 0 6px 15px rgba(90, 153, 214, 0.3);
}

.btn-save:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(90, 153, 214, 0.2);
}

.btn-cancel {
    background-color: #f0f0f0; /* 단일 색상으로 변경 */
    color: #666666;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.btn-cancel:hover {
    transform: translateY(-3px);
    background-color: #e5e5e5; /* 호버 색상 변경 */
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
    color: #555555;
}

.btn-cancel:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 데스크톱 환경 */
@media (min-width: 769px) {
    .content {
        max-width: 600px;
    }

    .profile-image {
        width: 120px;
        height: 120px;
    }

    .form-group {
        margin-bottom: 25px;
    }

    .form-input {
        height: 50px;
        font-size: 16px;
    }

    .btn {
        height: 50px;
    }
}

/* 태블릿 환경 */
@media (max-width: 768px) and (min-width: 481px) {
    .content {
        max-width: 500px;
    }

    .profile-image {
        width: 110px;
        height: 110px;
    }

    .button-group {
        margin-top: 30px;
    }
}

/* 모바일 환경 - 이미지와 일치하도록 조정 */
@media (max-width: 480px) {
    .header {
        padding: 15px;
    }

    .logo {
        font-size: 24px;
    }

    .content {
        padding: 0 15px;
    }

    .page-title {
        font-size: 20px;
    }

    .title-underline {
        margin-bottom: 25px;
    }

    .profile-image {
        width: 90px;
        height: 90px;
    }

    .camera-button {
        width: 26px;
        height: 26px;
    }

    .camera-icon {
        width: 10px;
        height: 10px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        font-size: 15px;
        margin-bottom: 6px;
    }

    .form-input {
        height: 40px;
        font-size: 14px;
    }

    .button-group {
        margin-top: 25px;
    }

    .btn {
        height: 40px;
        font-size: 15px;
    }
}
</style>
