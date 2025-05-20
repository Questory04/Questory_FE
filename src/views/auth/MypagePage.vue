<template>
    <div class="mypage-container">
        <!-- 사용자 정보 카드 섹션 -->
        <div class="cards-container">
            <!-- 내 정보 카드 -->
            <div class="info-card">
                <div class="card-header">내 정보</div>
                <div class="card-content">
                    <div class="user-profile">
                        <div class="avatar-container">
                            <div class="avatar"></div>
                        </div>
                        <div class="user-details">
                            <div class="username">{{ user.nickname }}</div>
                            <div class="email">{{ user.email }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 경험치 카드 -->
            <div class="info-card">
                <div class="card-header">{{ user.currentExp }}</div>
                <div class="card-content">
                    <div class="level-info">
                        <div class="badge">{{ user.title }}</div>
                        <div class="level">Lv {{ level }}</div>
                        <div class="exp-points">
                            {{ currentExpInLevel }} / {{ maxExpForLevel }}
                        </div>
                    </div>
                    <div class="progress-container">
                        <div
                            class="progress-bar"
                            :style="{ width: progressPercentage + '%' }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 정보 수정 및 탈퇴 섹션 -->
        <div class="settings-container">
            <div class="settings-header">정보 수정 및 탈퇴</div>
            <div class="settings-content">
                <button class="btn btn-primary" @click="editUserInfo">
                    정보 수정
                </button>
                <button class="btn btn-primary" @click="changePassword">
                    비밀번호 변경
                </button>
                <button class="btn btn-outline" @click="withdrawAccount">
                    회원 탈퇴
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const user = ref({
    nickname: "",
    email: "",
    badge: "",
    currentExp: 0,
});

const level = computed(() => Math.floor(user.value.currentExp / 100));
const currentExpInLevel = computed(() => user.value.currentExp % 100);
const maxExpForLevel = 100;

const progressPercentage = computed(() => {
    return (currentExpInLevel.value / maxExpForLevel) * 100;
});

const getUserInfo = async () => {
    try {
        const res = await axios.get("http://localhost:8080/me", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        const data = res.data;

        user.value.nickname = data.nickname;
        user.value.email = data.email;
        user.value.badge = data.title;
        user.value.currentExp = data.exp;
    } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
        alert("로그인이 필요합니다.");
        router.push("/login");
    }
};

const editUserInfo = () => {
    router.push("/edit-profile");
};

const changePassword = () => {
    router.push("/change-password");
};

const withdrawAccount = async () => {
    if (confirm("정말로 탈퇴하시겠습니까?")) {
        try {
            await axios.patch("http://localhost:8080/me/withdraw", null, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            console.log("요청 보냄ㅠㅠ");

            // 토큰 제거 및 로그아웃 처리
            authStore.clearTokens();
            alert("정상적으로 탈퇴되었습니다.");
            router.push("/login");
        } catch (error) {
            console.error("회원 탈퇴 실패:", error);
            alert("탈퇴 처리 중 오류가 발생했습니다.");
        }
    }
};

onMounted(() => {
    getUserInfo();
});
</script>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.mypage-container {
    width: 100%;
    max-width: 75rem; /* 1200px */
    margin: 0 auto;
    padding: 1.25rem; /* 20px */
    font-family: "Noto Sans KR", Arial, sans-serif;
    color: #333;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
}

.avatar {
    width: 2.5rem; /* 40px */
    height: 2.5rem; /* 40px */
    border-radius: 50%;
    background-color: #f0f0f0;
    border: 0.0625rem solid #e0e0e0; /* 1px */
}

.cards-container {
    display: flex;
    gap: 1.25rem; /* 20px */
    margin-bottom: 2.5rem; /* 40px */
    margin-top: 3.125rem; /* 50px */
    width: 100%;
    min-height: 12.5rem; /* 200px */
}

.info-card {
    flex: 1;
    background-color: #f5f8fa;
    border-radius: 0.75rem; /* 12px */
    overflow: hidden;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05); /* 0 2px 8px */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
}

.info-card:hover {
    transform: translateY(-0.125rem); /* -2px */
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1); /* 0 4px 12px */
}

.card-header {
    padding: 0.9375rem 1.25rem; /* 15px 20px */
    background-color: #edf6fc;
    color: #5a7b96;
    font-weight: bold;
    font-size: 1rem; /* 16px */
}

.card-content {
    padding: 1.5625rem; /* 25px */
    background-color: #f8fbfd;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.user-profile {
    display: flex;
    align-items: center;
    height: 100%;
}

.avatar-container {
    margin-right: 1.5625rem;
}

.avatar-container .avatar {
    width: 5rem;
    height: 5rem;
    border: 0.1875rem solid #fff;
    box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.08);
}

.user-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0.625rem;
    align-items: flex-start;
}

.username {
    font-weight: bold;
    color: #333;
    margin-bottom: 0.9375rem;
    font-size: 1.25rem;
}

.email {
    font-size: 1.125rem;
    color: #666;
}

.level-info {
    display: flex;
    align-items: center;
    margin-bottom: 1.25rem; /* 20px */
    height: 2.5rem; /* 40px */
}

.badge {
    padding: 0.4375rem 0.75rem; /* 7px 12px */
    background-color: #edf6fc;
    border-radius: 0.375rem; /* 6px */
    color: #5a99d6;
    font-size: 1.125rem; /* 18px */
    margin-right: 1.25rem; /* 20px */
    border: 0.0625rem solid #d9e6f2; /* 1px */
}

.level {
    font-weight: bold;
    color: #5a99d6;
    margin-right: 1.25rem; /* 20px */
    font-size: 1.125rem; /* 18px */
}

.exp-points {
    font-size: 0.875rem; /* 14px */
    color: #666;
    margin-left: auto;
}

.progress-container {
    height: 0.75rem; /* 12px */
    background-color: #e0e9f2;
    border-radius: 0.625rem; /* 10px */
    overflow: hidden;
    margin-top: 0.9375rem; /* 15px */
}

.progress-bar {
    height: 100%;
    background: linear-gradient(to right, #7eb9e6, #5a99d6);
    border-radius: 0.625rem; /* 10px */
    transition: width 0.5s ease;
}

.settings-container {
    background-color: #f5f8fa;
    border-radius: 0.75rem; /* 12px */
    overflow: hidden;
    padding: 1.875rem; /* 30px */
    width: 100%;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05); /* 0 2px 8px */
    margin-top: 2.5rem; /* 40px */
    margin-bottom: 2.5rem; /* 40px */
}

.settings-header {
    color: #5a7b96;
    font-weight: bold;
    margin-bottom: 1.5625rem; /* 25px */
    text-align: center;
    font-size: 1.125rem; /* 18px */
}

.settings-content {
    display: flex;
    flex-direction: column;
    gap: 0.9375rem; /* 15px */
}

.btn {
    padding: 1rem; /* 16px */
    border-radius: 0.5rem; /* 8px */
    border: none;
    font-size: 1rem; /* 16px */
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.btn-primary {
    background-color: #7eb9e6;
    color: white;
}

.btn-primary:hover {
    background-color: #6aaad9;
    transform: translateY(-0.125rem); /* -2px */
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1); /* 0 4px 8px */
}

.btn-outline {
    background-color: white;
    border: 0.0625rem solid #7eb9e6; /* 1px */
    color: #7eb9e6;
}

.btn-outline:hover {
    background-color: #f0f7ff;
    transform: translateY(-0.125rem); /* -2px */
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05); /* 0 4px 8px */
}

/* 반응형 스타일 */
@media (max-width: 75rem) {
    /* 1200px */
    .mypage-container {
        padding: 0.9375rem; /* 15px */
    }
}

@media (max-width: 62rem) {
    /* 992px */
    .cards-container {
        flex-direction: column;
    }

    .info-card {
        width: 100%;
        min-height: 9.375rem; /* 150px */
        margin-bottom: 1.25rem; /* 20px */
    }

    .card-content {
        padding: 1.25rem; /* 20px */
    }
}

@media (max-width: 48rem) {
    /* 768px */
    .header {
        padding: 0 0.625rem 0.9375rem 0.625rem; /* 0 10px 15px 10px */
        margin-bottom: 1.875rem; /* 30px */
    }

    .card-header {
        padding: 0.75rem 0.9375rem; /* 12px 15px */
    }

    .settings-container {
        padding: 1.25rem; /* 20px */
    }

    .btn {
        padding: 0.875rem; /* 14px */
        font-size: 0.9375rem; /* 15px */
    }

    .user-details {
        padding-left: 0.3125rem; /* 5px */
    }

    .username {
        font-size: 1.125rem; /* 18px */
        margin-bottom: 0.5rem; /* 8px */
    }
}

@media (max-width: 30rem) {
    /* 480px */
    .user-profile {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .avatar-container {
        margin-right: 0;
        margin-bottom: 1.25rem; /* 20px */
    }

    .user-details {
        padding-left: 0;
        align-items: center;
    }

    .level-info {
        flex-wrap: wrap;
        justify-content: space-between;
        height: auto;
        gap: 0.625rem; /* 10px */
    }

    .badge {
        margin-right: 0.625rem; /* 10px */
    }

    .exp-points {
        margin-left: 0;
        width: 100%;
        text-align: right;
    }
}
</style>
