<template>
    <div class="login-wrapper">
        <div class="login-container">
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=settings"
            />
            <BasicLogo />
            <div class="input-button-wrapper">
                <div class="input-group">
                    <FormInput v-model="email" placeholder="email" />
                </div>
                <div class="input-group">
                    <FormInput v-model="password" type="password" placeholder="password" />
                </div>
                <BasicTextButton msg="Login" type="background" @click="login" />
            </div>
            <div class="help-links">
                <a href="/signup">회원가입</a>
                <span>|</span>
                <a href="/find-password">비밀번호를 잊으셨나요?</a>
            </div>
            <SocialButton></SocialButton>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // ✅ Pinia 스토어 import

import BasicLogo from "@/components/common/BasicLogo";
import FormInput from "@/components/common/FormInput";
import BasicTextButton from "@/components/common/BasicTextbutton.vue";
import SocialButton from "@/components/common/SocialButton.vue";

const email = ref("");
const password = ref("");
const router = useRouter();
const authStore = useAuthStore(); // ✅ 스토어 인스턴스 생성

const login = async () => {
    if (!email.value || !password.value) {
        alert("이메일과 비밀번호를 모두 입력해주세요.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:8080/members/login", {
            email: email.value,
            password: password.value,
        });

        console.log("로그인 성공:", response.data);

        // ✅ accessToken과 refreshToken 저장
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken || ""; // 없으면 빈 문자열

        authStore.setTokens(accessToken, refreshToken); // ✅ 저장

        alert("로그인 성공!");
        router.push("/");
    } catch (error) {
        console.error("로그인 실패:", error);
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
};
</script>
<style scoped>
.login-wrapper {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    padding: 1rem;
    box-sizing: border-box;
}

.login-container {
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input-group {
    display: flex;
    margin-bottom: 1rem;
    width: 100%;
}

.input-button-wrapper {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
}

.help-links {
    font-size: 0.8rem;
    color: gray;
    margin-bottom: 1.5rem;
    text-align: center;
}

.help-links a {
    color: gray;
    text-decoration: none;
    margin: 0 5px;
}

@media screen and (max-width: 480px) {
    .login-container {
        max-width: 100%;
    }

    .help-links {
        font-size: 0.75rem;
    }
}
</style>
