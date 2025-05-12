<template>
    <section class="section popular-routes">
        <BasicTitle msg="🗺️ 인기 여행 루트" color="black" />
        <Swiper
            :slides-per-view="1"
            :space-between="16"
            :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 35 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
                1280: { slidesPerView: 4, spaceBetween: 45 },
            }"
        >
            <SwiperSlide v-for="n in 5" :key="n">
                <div class="card">
                    <img class="thumbnail" src="@/assets/images/street-bukchon.jpg" alt="서울 도심 산책" />
                    <h3 class="title">서울 도심 속 감성 산책</h3>
                    <p class="nickname">
                        <img
                            class="profile-image"
                            :src="userProfileImage"
                            alt="유저 프로필"
                            @error="setDefaultImage"
                            ref="profileImg"
                        />
                        유저 닉네임
                    </p>
                    <p class="info">장소 5개 • 3시간 예상</p>
                    <div class="stats">
                        <span class="stat-item">
                            <img src="@/assets/images/icons/heart-icon.svg" alt="좋아요" class="icon" />
                            82
                        </span>
                        <span class="stat-item">
                            <img src="@/assets/images/icons/comment-icon.svg" alt="댓글" class="icon" />
                            14
                        </span>
                    </div>

                    <div class="tags">
                        <span>#감성사진</span>
                        <span>#데이트</span>
                        <span>#한옥거리</span>
                    </div>
                    <button class="follow-btn">따라가기</button>
                </div>
            </SwiperSlide>
        </Swiper>
    </section>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import BasicTitle from "../common/BasicTitle.vue";

export default {
    name: "PopularRoutes",
    components: {
        Swiper,
        SwiperSlide,
        BasicTitle,
    },
    data() {
        return {
            userProfileImage: require("@/assets/images/profile-image.png"),
        };
    },
};
</script>

<style scoped>
.section {
    margin-bottom: 20px;
}

.card {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #b3b3b3;
    box-shadow: 6px 7px 8px rgb(0 0 0 / 20%);
}

.thumbnail {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 12px;
}

.card h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 6px 0;
}

.card p {
    font-size: 13px;
    margin: 2px 0;
    color: #444;
}

.card button {
    margin-top: 10px;
    background: #7db4d5;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    transition: background 0.2s ease;
}

.card button:hover {
    background: #5da0c4;
}

.profile-image {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 6px;
    vertical-align: middle;
}

.stats {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin: 6px 0;
    font-size: 13px;
    align-items: center;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #444;
}

.icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

::v-deep(.swiper-horizontal) {
    padding: 0 1rem;
}

::v-deep(.swiper-wrapper) {
    padding: 1rem;
}
</style>
