<template>
    <div class="login-wrapper">
        <div class="login-container">
            <h2 class="title">Questory</h2>
            <FormInput v-model="email" placeholder="email" />
            <FormInput v-model="password" type="password" placeholder="password" />
            <button class="login-button">Login</button>
            <div class="help-links">
                <a href="#">회원가입</a>
                <span>|</span>
                <a href="#">비밀번호를 잊으셨나요?</a>
            </div>
            <div class="social-login">
                <img src="../../assets/images/social/Kakao Social Login Button.png" alt="kakao" class="social-icon" />
                <img src="../../assets/images/social/Naver Social Login Button.png" alt="naver" class="social-icon" />
                <img src="../../assets/images/social/Google Social Login Button.png" alt="google" class="social-icon" />
            </div>
        </div>
    </div>
</template>

<script>
import FormInput from "../common/FormInput";

export default {
    name: "BasicTitle",
    components: {
        // HelloWorld,
        FormInput,
    },
};
</script>

<style>
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
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    padding: 1rem;
    width: 100%;
    max-width: 400px;
}

.title {
    color: #87a6c9;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: bold;
    text-align: center;
}

.login-button {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    background-color: #89b2d4;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    margin: 1rem 0;
    cursor: pointer;
    box-sizing: border-box;
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

.social-login {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.social-icon {
    width: 36px;
    height: 36px;
}

@media (min-width: 768px) {
    .input,
    .login-button {
        max-width: 350px;
    }
}
</style>
