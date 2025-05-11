<template>
    <div class="signup-wrapper">
        <div class="signup-container">
            <BasicLogo />
            <div class="form-container">
                <div class="input-group">
                    <FormInput v-model="email" placeholder="email" />
                    <button class="verify-btn">전송</button>
                </div>
                <div class="input-group">
                    <FormInput v-model="phoneAuth" placeholder="인증번호 입력" />
                    <button class="verify-btn">확인</button>
                </div>
                <div class="input-group password-group">
                    <FormInput type="password" v-model="password" placeholder="password" />
                </div>
                <div class="input-field-wrapper">
                    <FormInput type="password" v-model="passwordCheck" placeholder="password check" />
                </div>
                <div class="input-field-wrapper">
                    <FormInput type="text" v-model="nickname" placeholder="nickname" />
                </div>
                <BasicTextButton msg="Signup" type="background" />
                <div class="help-links">
                    <a href="/login">이미 계정이 있습니다.</a>
                </div>
                <SocialButton></SocialButton>
            </div>
        </div>
    </div>
</template>

<script>
import BasicTextButton from "@/components/common/BasicTextbutton.vue";
import BasicLogo from "@/components/common/BasicLogo.vue";
import FormInput from "@/components/common/FormInput.vue";
import SocialButton from "@/components/common/SocialButton.vue";

export default {
    name: "SignupForm",
    data() {
        return {
            email: "",
            phoneAuth: "",
            password: "",
            passwordCheck: "",
            nickname: "",
            showPassword: false,
        };
    },
    components: {
        SocialButton,
        BasicLogo,
        FormInput,
        BasicTextButton,
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        signup() {
            if (!this.email || !this.phoneAuth || !this.password || !this.passwordCheck || !this.nickname) {
                alert("모든 필드를 입력해주세요.");
                return;
            }
            if (this.password !== this.passwordCheck) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            console.log("Sign up form submitted:", {
                email: this.email,
                phoneAuth: this.phoneAuth,
                password: this.password,
                nickname: this.nickname,
            });
        },
    },
};
</script>

<style scoped>
.signup-wrapper {
    height: 80vh; 
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    padding: 1rem;
    box-sizing: border-box;
}

.input {
    flex: 1;
    padding: 0.8rem 1rem;
    height: 48px;
    border: none;
    border-radius: 8px;
    background-color: #e5e8eb;
    font-size: 1rem;
    box-sizing: border-box;
}

.signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 480px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.form-container {
    width: 100%;
}

.input-group {
    display: flex;
    align-items: stretch;
    width: 100%;
    /* height: 100%; */
    margin-bottom: 1rem;
}

.input-field-wrapper {
    margin-bottom: 1rem;
    width: 100%;
}

.input-field {
    flex: 1;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f1f3f5;
    font-size: 1rem;
    width: 100%;
}

.verify-btn {
    padding: 0 1.5rem;
    background-color: #74b1d4;
    color: white;
    border: none;
    border-radius: 8px;
    margin-left: 0.5rem;
    cursor: pointer;
    font-weight: bold;
    white-space: nowrap;
}
.password-group {
    position: relative;
}

.eye-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
}

.signup-btn {
    width: 100%;
    padding: 0.8rem;
    background-color: #74b1d4;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
}

.login-link {
    text-align: center;
    margin: 1rem 0;
    color: #666;
    cursor: pointer;
}

.social-login {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.social-btn {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.social-btn img {
    width: 60%;
    height: 60%;
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
