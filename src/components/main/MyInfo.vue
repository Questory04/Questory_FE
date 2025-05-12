<template>
    <div>
        <BasicTitle msg="My" color="black" />
        <aside class="my-info">
            <div class="profile-section">
                <div class="profile-image"></div>
                <div class="profile-text">
                    <div class="badge">칭호명</div>
                    <div class="name">이름</div>

                    <!-- <v-progress-linear
                        :model-value="(exp / maxExp) * 100"
                        height="6"
                        color="#7db4d5"
                        rounded
                        background-color="#e0e0e0"
                    ></v-progress-linear> -->
                </div>
            </div>
            <div class="level-exp">
                <span class="level">Lv 3</span>
                <span class="exp">{{ exp }}/{{ maxExp }}</span>
            </div>
            <v-progress-linear
                model-value="45"
                height="6"
                color="#7db4d5"
                rounded
                background-color="#e0e0e0"
            ></v-progress-linear>

            <div class="stats">
                <div class="stat-item">
                    <div class="label">
                        <img src="@/assets/images/icons/thumbtack-icon.svg" class="icon" />
                        <span>나의 여행 루트</span>
                    </div>
                    <strong>5</strong>
                </div>
                <div class="stat-item">
                    <div class="label">
                        <img src="@/assets/images/icons/badge-icon.svg" class="icon" />
                        <span>나의 스탬프</span>
                    </div>
                    <strong>10</strong>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import BasicTitle from "../common/BasicTitle.vue";

export default {
    name: "MyInfo",
    components: {
        BasicTitle,
    },
    data() {
        return {
            exp: 231,
            maxExp: 243,
        };
    },
};
</script>

<style scoped>
.my-info {
    background: #fff;
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    line-height: 1.6;
}

.profile-section {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.profile-image {
    width: 50px;
    height: 50px;
    background-color: #e0e0e0;
    border-radius: 50%;
    margin-right: 12px;
}

.profile-text {
    flex: 1;
}

.badge {
    background: #a7d3f4;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    margin-bottom: 2px;
}

.name {
    font-weight: bold;
    margin-bottom: 4px;
}

.level-exp {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #555;
    margin-bottom: 4px;
}

.stats {
    margin: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.label {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-grow: 1;
}

.icon {
    width: 16px;
    height: 16px;
}

.stats p {
    display: flex;
    align-items: center;
    gap: 6px;
}

.alert h4 {
    font-weight: bold;
    margin-bottom: 4px;
}
</style>
