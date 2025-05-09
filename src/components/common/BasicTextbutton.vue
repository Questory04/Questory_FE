<template>
    <button :class="['login-button', type]">{{ msg }}</button>
</template>

<script>
export default {
    name: "BasicTextButton",
    props: {
        msg: String,
        type: {
            type: String,
            default: "text",
        },
    },
};
</script>

<style scoped>
.login-button {
    width: 100%;
    max-width: 100%;
    padding: 12px;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    margin: 1rem 0;
    cursor: pointer;
    box-sizing: border-box;
}

.text {
    background: none;
    color: #333;
}

.background {
    background-color: #89b2d4;
    color: white;
}
</style>
