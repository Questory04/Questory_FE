<template>
    <div class="forgot-password-container">
        <BasicLogo />
        <div class="form-box">
            <BasicTitle msg="비밀번호 찾기" />
            <input type="email" class="input-field" placeholder="email" v-model="email" />
            <BasicTextButton msg="Submit" type="background" />
            <div class="help-links">
                <a href="/login">로그인</a>
                <span>|</span>
                <a href="/signup">회원가입</a>
            </div>
        </div>
    </div>
</template>

<script>
import BasicTitle from "@/components/common/BasicTitle.vue";
import BasicLogo from "@/components/common/BasicLogo.vue";
import BasicTextButton from "@/components/common/BasicTextbutton.vue";

export default {
    name: "ForgotPasswordView",
    data() {
        return {
            email: "",
        };
    },
    components: {
        BasicTitle,
        BasicLogo,
        BasicTextButton,
    },
};
</script>

<style scoped>
.forgot-password-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.form-box {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.subtitle {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
}

.input-field {
    height: 40px;
    padding: 0 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: #f0f2f5;
    margin-bottom: 12px;
}

.submit-btn {
    height: 40px;
    background-color: #7db4d5;
    color: #000;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
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
</style>
