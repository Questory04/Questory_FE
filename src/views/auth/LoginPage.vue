<template>
    <div class="login-wrapper">
        <div class="login-container">
            <BasicLogo />
            <div class="input-button-wrapper">
                <div class="input-group">
                    <FormInput v-model="email" placeholder="email" />
                </div>
                <div class="input-group">
                    <FormInput v-model="password" type="password" placeholder="password" />
                </div>
                <BasicTextButton msg="Login" type="background" />
            </div>
            <div class="help-links">
                <a href="#">회원가입</a>
                <span>|</span>
                <a href="#">비밀번호를 잊으셨나요?</a>
            </div>
            <SocialButton></SocialButton>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import BasicLogo from "@/components/common/BasicLogo";
import FormInput from "@/components/common/FormInput";
import BasicTextButton from "@/components/common/BasicTextbutton.vue";
import SocialButton from "@/components/common/SocialButton.vue";

const email = ref("");
const password = ref("");
</script>

<style scoped>
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-y: hidden;
}

.login-wrapper {
    height: 100vh;
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
