<template>
    <header class="app-header">
        <div class="container">
            <a href="/" class="logo">Questory</a>
            <template v-if="isLoggedIn">
                <nav class="nav-menu">
                    <div class="nav-dropdown">
                        <a href="/quests" class="nav-item">퀘스트</a>
                        <div class="dropdown-content">
                            <a href="/quests" class="dropdown-item">전체 퀘스트</a>
                            <a href="/quests/me/active" class="dropdown-item">진행중인 퀘스트</a>
                            <a href="/quests/me/created" class="dropdown-item">내가 만든 퀘스트</a>
                            <a href="/add-quest" class="dropdown-item">퀘스트 생성</a>
                        </div>
                    </div>
                    <div class="nav-dropdown">
                        <a href="/plans" class="nav-item">여행</a>
                        <div class="dropdown-content">
                            <a href="/plans/create" class="dropdown-item">계획 생성</a>
                            <a href="plans/all" class="dropdown-item">전체 계획</a>
                            <a href="/plans" class="dropdown-item">내 계획</a>
                            <a href="/plans/copy" class="dropdown-item">공유 받은 계획</a>
                        </div>
                    </div>
                    <div class="nav-dropdown">
                        <a href="/boards" class="nav-item">커뮤니티</a>
                        <div class="dropdown-content">
                            <a href="/boards/notice" class="dropdown-item">공지사항</a>
                            <a href="/boards" class="dropdown-item">전체 글</a>
                            <a href="/boards/me" class="dropdown-item">내가 작성한 글</a>
                        </div>
                    </div>
                    <a href="/friends" class="nav-item">친구</a>
                    <a href="/stamps" class="nav-item">스탬프</a>
                </nav>
                <nav>
                    <a href="/myPage" class="nav-item"> 마이페이지</a>
                    <a href="" class="nav-item" @click.prevent="logout">로그아웃</a>
                </nav>
            </template>
            <template v-else>
                <nav class="nav-menu">
                    <a href="/login" class="nav-item">로그인</a>
                    <a href="/signup" class="nav-item">회원가입</a>
                </nav>
            </template>
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
    border-radius: 1.25rem;
    transition: all 0.3s;
}

.nav-item:hover {
    background: #4a90e2;
    color: white;
}

.app-header {
    background-color: white;
    border-bottom: 0.07rem solid #ddd;
    padding: 1rem 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #87a6c9;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.profile-icon {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background-color: #dcdcdc;
}

.nav-dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    min-width: 12rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    z-index: 1001;
    border: 0.0625rem solid #e9ecef;
    margin-top: 0.25rem;

    left: 50%; /* 부모 요소의 가운데 기준 */
    transform: translateX(-50%); /* 자신의 너비의 50%만큼 왼쪽으로 이동 */
}

.nav-dropdown:hover .dropdown-content {
    display: block;
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from {
        transform: translateX(-50%) translateY(-0.5rem);
    }
    to {
        transform: translateX(-50%) translateY(0);
    }
}

.dropdown-item {
    color: #333;
    padding: 0.75rem 1rem;
    text-decoration: none;
    display: block;
    transition: all 0.2s;
    border-radius: 0;
    font-size: 0.9rem;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
    color: #4a90e2;
    padding-left: 1.25rem;
}

/* 반응형 대응 */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }

    .dropdown-content {
        position: fixed;
        top: 4rem;
        left: 1rem;
        right: 1rem;
        min-width: auto;
        transform: none;
    }
}
</style>
