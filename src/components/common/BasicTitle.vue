<template>
    <h3 class="basic-title" :style="{ color: color }">{{ msg }}</h3>
</template>

<script>
export default {
    name: "BasicTitle",
    props: {
        msg: String,
        color: {
            type: String,
            default: "rgb(134, 134, 134)",
        },
    },
};
</script>

<style>
.basic-title {
    display: flex;
}
</style>
