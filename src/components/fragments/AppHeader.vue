<template>
    <header class="app-header">
        <div class="container">
            <div class="logo">Questory</div>
            <nav class="nav-menu">
                <a href="/login" class="nav-link">로그인</a>
                <a href="/signup" class="nav-link">회원가입</a>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    name: "AppHeader",
};
</script>

<style scoped>
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

.nav-link {
    text-decoration: none;
    color: #333;
    font-size: 14px;
}

.profile-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #dcdcdc;
}
</style>
