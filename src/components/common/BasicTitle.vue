<template>
    <h3 class="basic-title">{{ msg }}</h3>
</template>
<script>
export default {
    name: "BasicTitle",
    props: {
        msg: String,
    },
};
</script>
<style>
.basic-title {
    display: flex;
    color: rgb(134, 134, 134);
}
</style>
