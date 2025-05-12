<template>
    <BasicTitle msg="👤 My" color="black" />
    <aside class="my-info">
        <div class="profile-box">
            <div class="badge">등록됨</div>
            <div class="name">이름</div>
            <div class="level">Lv.3</div>
            <div class="exp">23 / 243</div>
        </div>
        <p>나의 여행 루트: <strong>5</strong></p>
        <p>나의 스탬프: <strong>10</strong></p>
        <div class="alert">
            <h4>알림</h4>
            <p>OOO님이 친구 요청을 보냈습니다.</p>
        </div>
    </aside>
</template>

<script>
import BasicTitle from "../common/BasicTitle.vue";

export default {
    name: "MyInfo",
    components: {
        BasicTitle,
    },
};
</script>

<style scoped>
.my-info {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px #eee;
}

.badge {
    background: #7db4d5;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    display: inline-block;
}

.alert {
    margin-top: 10px;
    font-size: 14px;
}
</style>
