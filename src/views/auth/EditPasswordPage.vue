<template>
    <div class="edit-password-page">
        <div class="content">
            <h2 class="page-title">비밀번호 변경</h2>
            <form @submit.prevent="changePassword" class="edit-form">
                <div class="form-group">
                    <label for="newPassword">새 비밀번호</label>
                    <div class="input-container">
                        <input
                            type="password"
                            id="newPassword"
                            v-model="newPassword"
                            class="form-input"
                            placeholder="새 비밀번호"
                            required
                        />
                        <div class="input-focus-indicator"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">비밀번호 확인</label>
                    <div class="input-container">
                        <input
                            type="password"
                            id="confirmPassword"
                            v-model="confirmPassword"
                            class="form-input"
                            placeholder="비밀번호 확인"
                            required
                        />
                        <div class="input-focus-indicator"></div>
                    </div>
                </div>

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

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const newPassword = ref("");
const confirmPassword = ref("");

const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        await axios.patch(
            "http://localhost:8080/me/password",
            { password: newPassword.value },
            {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        alert("비밀번호가 변경되었습니다.");
        router.push("/mypage");
    } catch (error) {
        console.error("비밀번호 변경 실패:", error);
        alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
};

const cancel = () => {
    if (newPassword.value || confirmPassword.value) {
        if (
            confirm(
                "변경 사항이 저장되지 않을 수 있습니다. 정말로 취소하시겠습니까?"
            )
        ) {
            router.push("/mypage");
        }
    } else {
        router.push("/mypage");
    }
};
</script>

<style scoped>
/* 기존 스타일 파일에서 .edit-profile-page 클래스를 .edit-password-page로 바꾸고 그대로 복사하면 됨 */
.edit-password-page {
    width: 100%;
    min-height: 80vh;
    background-color: #ffffff;
    font-family: "Noto Sans KR", Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
}

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

.page-title {
    color: #6aaad9;
    font-size: 28px;
    text-align: center;
    margin-bottom: 40px;
    font-weight: 600;
    position: relative;
}

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
}

.form-input:focus {
    outline: none;
    border-color: #7eb9e6;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(126, 185, 230, 0.15);
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

.btn-save {
    background-color: #7eb9e6;
    color: white;
}

.btn-cancel {
    background-color: #f0f0f0;
    color: #666666;
}
</style>
