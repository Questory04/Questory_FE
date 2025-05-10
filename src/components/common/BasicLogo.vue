<template>
    <h2 class="title">Questory</h2>
</template>
<style>
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
