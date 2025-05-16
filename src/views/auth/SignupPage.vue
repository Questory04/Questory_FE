<template>
    <div class="signup-wrapper">
        <div class="signup-container">
            <BasicLogo />
            <div class="form-container">
                <div class="input-group">
                    <FormInput v-model="email" placeholder="email" />
                    <button class="verify-btn" @click="sendVerifyEmail">전송</button>
                </div>
                <div class="input-group">
                    <FormInput v-model="phoneAuth" placeholder="인증번호 입력" />
                    <button class="verify-btn" @click="verifyEmailCode">확인</button>
                </div>
                <p v-if="isVerified" class="verified-msg">✅ 인증이 완료되었습니다.</p>
                <div class="input-group password-group">
                    <FormInput type="password" v-model="password" placeholder="password" />
                </div>
                <div class="input-field-wrapper">
                    <FormInput type="password" v-model="passwordCheck" placeholder="password check" />
                </div>
                <div class="input-field-wrapper">
                    <FormInput type="text" v-model="nickname" placeholder="nickname" />
                </div>
                <BasicTextButton msg="Signup" type="background" @click="regist" />

                <div class="help-links">
                    <a href="/login">이미 계정이 있습니다.</a>
                </div>

                <SocialButton />
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
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
            isVerified: false, // 인증 여부
        };
    },
    components: {
        SocialButton,
        BasicLogo,
        FormInput,
        BasicTextButton,
    },
    methods: {
        async sendVerifyEmail() {
            if (!this.email) {
                alert("이메일을 입력해주세요.");
                return;
            }

            try {
                const response = await axios.post("http://localhost:8080/members/send-verify", {
                    email: this.email,
                });
                alert(response.data.message);
            } catch (error) {
                console.error("인증코드 전송 실패:", error);
                alert(error.response?.data?.message || "전송 중 오류 발생");
            }
        },
        async verifyEmailCode() {
            if (!this.email || !this.phoneAuth) {
                alert("이메일과 인증코드를 모두 입력해주세요.");
                return;
            }

            try {
                const response = await axios.post("http://localhost:8080/members/verify-code", {
                    email: this.email,
                    code: this.phoneAuth,
                });
                alert(response.data.message);
                this.isVerified = true;
            } catch (error) {
                console.error("인증 실패:", error);
                alert(error.response?.data?.message || "인증 중 오류 발생");
                this.isVerified = false;
            }
        },
        async regist() {
            if (!this.isVerified) {
                alert("이메일 인증이 필요합니다.");
                return;
            }

            if (!this.email || !this.password || !this.passwordCheck || !this.nickname) {
                alert("모든 필드를 입력해주세요.");
                return;
            }

            if (this.password !== this.passwordCheck) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }

            try {
                await axios.post("http://localhost:8080/members/regist", {
                    email: this.email,
                    password: this.password,
                    nickname: this.nickname,
                });

                alert("회원가입이 완료되었습니다!");
                this.$router.push("/login");
            } catch (error) {
                console.error("회원가입 실패:", error);
                alert("회원가입 중 오류가 발생했습니다.");
            }
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
    margin-bottom: 1rem;
}
.input-field-wrapper {
    margin-bottom: 1rem;
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
.verified-msg {
    color: green;
    font-weight: bold;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
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
