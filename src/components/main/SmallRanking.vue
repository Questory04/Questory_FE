<template>
    <BasicTitle msg="🏆 랭킹" color="black"></BasicTitle>
    <div class="ranking-box">
        <ol class="ranking-list">
            <li v-for="(user, index) in rankingData" :key="index">
                <span class="rank">({{ index + 1 }})</span>
                <span class="name">{{ user.name }}</span>
                <span class="exp">{{ user.exp }} EXP</span>
            </li>
        </ol>
    </div>
</template>

<script>
import BasicTitle from "../common/BasicTitle.vue";

export default {
    name: "RankingList",
    components: {
        BasicTitle,
    },
    data() {
        return {
            rankingData: [
                { name: "이름1", exp: 123413 },
                { name: "이름2", exp: 114567 },
                { name: "이름3", exp: 112345 },
                { name: "이름4", exp: 108000 },
                { name: "이름5", exp: 107500 },
                { name: "이름6", exp: 104300 },
                { name: "이름7", exp: 102100 },
                { name: "이름8", exp: 99999 },
                { name: "이름9", exp: 98888 },
                { name: "이름10", exp: 97000 },
            ],
        };
    },
};
</script>

<style scoped>
.ranking-box {
    background: #f9f9f9;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    max-width: 300px;
}

.ranking-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
}

.ranking-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.ranking-list li {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 0.95rem;
    border-bottom: 1px solid #e0e0e0;
}

.rank {
    font-weight: bold;
    color: #444;
    margin-right: 0.5rem;
}

.name {
    flex: 1;
    text-align: left;
}

.exp {
    color: #888;
}
</style>
