<template>
  <div class="plan-editor-container">
    <h2 class="title">여행 계획 생성하기</h2>
    <div class="title-underline"></div>

    <div class="editor-content">
      <!-- 지도 영역 -->
      <div class="map-area">
        <p class="map-placeholder">지도!!!!!!!</p>
        <!-- 실제 지도 컴포넌트 삽입 예정 -->
      </div>

      <!-- 우측 컨트롤 영역 -->
      <div class="sidebar">
        <!-- 관광지 카드 영역 -->
        <div class="attraction-list">
            <div class="attraction-card">
                <div class="card-image"></div>
                <div class="card-info">
                    <div class="attraction-name">관광지 명</div>
                    <div class="attraction-type">TYPE</div>
                    <div class="attraction-address">주소</div>
                    <div class="attraction-desc">설명</div>
                </div>
            </div>
          <!-- 추가 관광지 카드 반복 -->
        </div>

        <!-- 일정 구성 영역 -->
        <div class="day-tabs">
          <button
            v-for="day in days"
            :key="day"
            :class="['day-tab', { active: activeDay === day }]"
            @click="activeDay = day"
          >
            DAY{{ day }}
          </button>
        </div>

        <div class="day-plan-box">
          <!-- activeDay에 해당하는 관광지 목록 렌더링 예정 -->
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="footer-buttons">
      <button class="btn btn-complete">완료</button>
      <button class="btn btn-cancel">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const days = [1, 2, 3, 4]
const activeDay = ref(1)
</script>

<style scoped>
/* 전체 컨테이너 */
.plan-editor-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 제목 및 구분선 */
.title {
  text-align: center;
  color: #5a9bd8;
  font-size: 1.8rem;
  margin-top: 1rem;
}

.title-underline {
  width: 200px;
  height: 3px;
  background-color: #5a9bd8;
  margin: 0.5rem auto 1.5rem;
}

/* 본문 영역 */
.editor-content {
  display: flex;
  width: 100%;
  gap: 16px;
}

/* 지도 영역 */
.map-area {
  flex: 3;
  background-color: #ccc;
  height: 400px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-placeholder {
  font-weight: bold;
  font-size: 1.2rem;
}

/* 사이드바 영역 */
.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 관광지 카드 리스트 (스크롤 가능) */
.attraction-list {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #bbb #f9f9f9;
}

/* Chrome, Edge, Safari용 스크롤바 */
.attraction-list::-webkit-scrollbar {
  width: 6px;
}
.attraction-list::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}
.attraction-list::-webkit-scrollbar-track {
  background-color: #f9f9f9;
}

/* 관광지 카드 */
.attraction-card {
  display: flex;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-image {
  width: 80px;
  height: 80px;
  background-color: #ccc;
  border-radius: 4px;
  flex-shrink: 0;
  margin-right: 10px;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.attraction-name {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 4px;
}

.attraction-type {
  display: inline-block;
  background-color: #78b5f3;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  width: fit-content;
  margin-bottom: 4px;
}

.attraction-address {
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 2px;
}

.attraction-desc {
  font-size: 0.8rem;
  color: #777;
}

/* DAY 탭 */
.day-tabs {
  display: flex;
  gap: 4px;
}

.day-tab {
  flex: 1;
  padding: 6px 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.day-tab.active {
  background-color: #4a90e2;
  color: white;
}

/* DAY별 계획 박스 */
.day-plan-box {
  height: 160px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  overflow-y: auto;
}

/* 하단 버튼 */
.footer-buttons {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.btn {
  width: 160px;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-complete {
  background-color: #7eb9e6;
  color: white;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

</style>