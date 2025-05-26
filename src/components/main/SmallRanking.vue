<template>
  <div class="ranking-container">
    <div class="header">
      <h3>🏆 랭킹</h3>
      <router-link to="/ranking" class="more-link">더보기</router-link>
    </div>
    <ul class="ranking-list">
      <li v-for="(user, index) in topRankings" :key="user.email" class="ranking-item">
        <span class="rank-badge">{{ index + 1 }}위</span>
        <span class="nickname">{{ user.nickname }}</span>
        <span class="exp">{{ user.exp.toLocaleString() }} exp</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const topRankings = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/ranking')
    topRankings.value = response.data.slice(0, 10)
  } catch (err) {
    console.error('랭킹 불러오기 실패:', err)
  }
})
</script>

<style scoped>
.ranking-container {
  background-color: #fdfdfd;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-family: 'Pretendard', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h3 {
  margin: 0;
  font-size: 18px;
}

.more-link {
  font-size: 14px;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}
.more-link:hover {
  color: #3498db;
}

.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  background-color: #ffffff;
  transition: background-color 0.2s;
}

.ranking-item:hover {
  background-color: #f0f8ff;
}

.rank-badge {
  font-weight: bold;
  width: 48px;
  text-align: left;
  color: #ff9800;
}

.nickname {
  flex-grow: 1;
  text-align: left;
  padding-left: 8px;
  font-weight: 500;
  color: #333;
}

.exp {
  font-size: 14px;
  color: #666;
}
</style>
