<template>
    <BasicTitle msg="랭킹" color="black" />
    <aside class="ranking">
        <ol>
            <li v-for="i in 5" :key="i">({{ i }}) 이름 - 123413 EXP</li>
        </ol>
    </aside>
</template>

<script>
import BasicTitle from "../common/BasicTitle.vue";

export default {
    name: "SmallRanking",
    components: {
        BasicTitle,
    },
};
</script>

<style scoped>
.ranking {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px #eee;
}
</style>
