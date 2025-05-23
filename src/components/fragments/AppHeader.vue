<template>
    <header class="app-header">
        <div class="container">
            <a href="/main" class="logo">Questory</a>
            <nav class="nav-menu">
                <template v-if="isLoggedIn">
                    <a href="/quests" class="nav-item">퀘스트</a>
                    <a href="/#" class="nav-item">여행</a>
                    <a href="/#" class="nav-item">커뮤니티</a>
                    <a href="/#" class="nav-item">친구</a>
                    <a href="/stamps" class="nav-item">스탬프</a>
                    <a href="/myPage" class="nav-item"> 마이페이지</a>
                    <a href="#" class="nav-item" @click.prevent="logout">로그아웃</a>
                </template>
                <template v-else>
                    <a href="/login" class="nav-item">로그인</a>
                    <a href="/signup" class="nav-item">회원가입</a>
                </template>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

const logout = () => {
    authStore.clearTokens();
    window.location.href = "/";
};
</script>

<style scoped>
.nav-item {
    color: #666;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    transition: all 0.3s;
}

.nav-item:hover {
    background: #4a90e2;
    color: white;
}

.app-header {
    background-color: white;
    border-bottom: 1px solid #ddd;
    padding: 16px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: #87a6c9;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 16px;
}

.profile-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #dcdcdc;
}
</style>
