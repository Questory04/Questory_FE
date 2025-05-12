<template>
    <section class="titlePage">
        <div class="titlePage-content">
            <h1>
                지금 <span class="highlight">Questory</span>와 함께 <br />
                우리 지역의 관광지를 탐험하고, <br />
                나만의 여정을 완성하세요.
            </h1>
            <!-- <a href="#popular-cities" class="cta-btn mt-4"> 여행지 둘러보기 <i class="fas fa-arrow-right ms-2"></i> </a> -->
        </div>

        <!-- 로그인 된 경우에만 보여짐 -->
        <div v-if="member" class="contact-form top-rank-container">
            <h3>인기 여행지 TOP 10</h3>
            <ul class="rank-list">
                <li v-for="(attraction, index) in topAttractions" :key="attraction.no" class="rank-item">
                    <a :href="`${root}/attraction?action=randomDetailAttraction&no=${attraction.no}`" class="rank-link">
                        <span class="rank-number">{{ index + 1 }}</span>
                        <span class="rank-title">{{ attraction.title }}</span>
                        <span class="rank-region">{{ attraction.sido }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import "@/assets/styles/index.css";

export default {
    name: "MainBanner",
    props: {
        topAttractions: {
            type: Array,
            required: true,
        },
        member: {
            type: Object,
            default: null,
        },
        root: {
            type: String,
            default: "",
        },
    },
};
</script>

<style scoped>
.banner {
    background-color: #ccc;
    height: 150px;
    margin: 20px 0;
    border-radius: 8px;
}

.titlePage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin: 2rem 1rem;
    text-align: center;
}

.titlePage-content h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.4;
}

.highlight {
    color: #f7b733; /* 강조 색 */
}

/* 인기 여행지 영역 */
.top-rank-container {
    width: 100%;
    max-width: 480px;
    background: #fff;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.rank-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.rank-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.rank-link {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #333;
    text-decoration: none;
    font-size: 0.95rem;
}

.rank-number {
    font-weight: bold;
    margin-right: 0.5rem;
    color: #555;
}

.rank-title {
    flex: 1;
    text-align: left;
}

.rank-region {
    color: #aaa;
    font-size: 0.85rem;
}

/* 반응형 대응 */
@media (min-width: 768px) {
    .titlePage {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
    }

    .titlePage-content {
        flex: 1;
    }

    .titlePage-content h1 {
        font-size: 1.5rem;
    }

    .top-rank-container {
        margin-left: 2rem;
    }
}

@media (min-width: 1024px) {
    .titlePage-content h1 {
        font-size: 2.5rem;
    }
}
</style>
