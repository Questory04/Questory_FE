<template>
    <div class="plan-create-container">
        <h2 class="title">여행 계획 생성하기</h2>
        <div class="title-underline"></div>

        <p class="description">여행 계획을 생성해보세요!</p>

        <form @submit.prevent="handleSubmit" class="form-box">
            <label>
                계획 제목
                <input v-model="plan.title" type="text" required />
            </label>
            <label>
                시작일
                <input v-model="plan.startDate" type="date" required />
            </label>
            <label>
                종료일
                <input v-model="plan.endDate" type="date" required />
            </label>
            <label>
                설명
                <textarea v-model="plan.description" rows="4" />
            </label>
            <div class="button-group">
                <button type="submit" class="btn btn-save">
                    <span class="btn-text">생성</span>
                </button>
                <button type="button" class="btn btn-cancel" @click="resetForm">
                    <span class="btn-text">취소</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const plan = reactive({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    routes: [], // 임시로 비워두고, 추후 관광지 추가 시 동적으로 삽입
});

const handleSubmit = async () => {
    try {
        const response = await axios.post(
            "http://localhost:8080/plans",
            {
                ...plan,
                // 날짜는 문자열을 ISO 형식으로 변환
                startDate: `${plan.startDate}T00:00:00`,
                endDate: `${plan.endDate}T00:00:00`,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const planId = response.data.plan.planId;
        router.push({
            path: `/plans/${planId}/edit`,
            query: {
                totalDays: response.data.plan.days, // 또는 계산된 일수
            },
        });
    } catch (err) {
        console.error(err);
        alert("여행 계획 생성 실패");
    }
};

const resetForm = () => {
    plan.title = "";
    plan.startDate = "";
    plan.endDate = "";
    plan.description = "";
};
</script>

<style scoped>
.title {
    text-align: center;
    color: #5a9bd8;
    font-size: 1.8rem;
    margin-top: 1rem;
}

.title-underline {
    width: 200px;
    height: 3px;
    background-color: #5a9bd8;
    margin: 0.5rem auto 1.5rem;
}

.description {
    text-align: center;
    color: #666;
    margin-bottom: 1.5rem;
}

.plan-create-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 24px;
    border-radius: 8px;
    background-color: #fff;
}

.form-box label {
    display: block;
    margin-bottom: 16px;
    font-size: 14px;
    color: #333;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    margin-top: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
}

/* 버튼 스타일 (회원 정보 수정 화면 그대로 반영 + 반응형) */
.button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
    width: 100%;
}

.btn {
    position: relative;
    width: 180px;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
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
    background-color: #7eb9e6;
    color: white;
    box-shadow: 0 2px 10px rgba(90, 153, 214, 0.2);
}

.btn-save:hover {
    transform: translateY(-3px);
    background-color: #6aaad9;
    box-shadow: 0 6px 15px rgba(90, 153, 214, 0.3);
}

.btn-save:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(90, 153, 214, 0.2);
}

.btn-cancel {
    background-color: #f0f0f0;
    color: #666666;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.btn-cancel:hover {
    transform: translateY(-3px);
    background-color: #e5e5e5;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
    color: #555555;
}

.btn-cancel:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 데스크톱 */
@media (min-width: 769px) {
    .btn {
        width: 180px;
        height: 48px;
        font-size: 16px;
    }
}

/* 태블릿 */
@media (max-width: 768px) and (min-width: 481px) {
    .btn {
        width: 160px;
        height: 44px;
        font-size: 15px;
    }

    .button-group {
        gap: 16px;
        margin-top: 24px;
    }
}

/* 모바일 */
@media (max-width: 480px) {
    .btn {
        width: 100%;
        height: 42px;
        font-size: 14px;
    }

    .button-group {
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
    }
}
</style>
