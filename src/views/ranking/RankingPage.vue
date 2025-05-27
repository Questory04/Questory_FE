<template>
  <div class="ranking-page">
    <PageTitle title="전체 유저 랭킹" subtitle="나의 랭킹을 확인해보세요." />

    <div v-if="myRanking" class="my-ranking-box">
      <span class="rank-icon">
        {{ myRanking.rank === 1 ? '🥇' : myRanking.rank === 2 ? '🥈' : myRanking.rank === 3 ? '🥉' : `${myRanking.rank}위` }}
      </span>
      <span class="nickname">{{ myRanking.nickname }}</span>
      <span class="exp">{{ myRanking.exp.toLocaleString() }} exp</span>
    </div>

    <div class="table-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>닉네임</th>
            <th>경험치</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in allRankings" :key="user.email">
            <td class="rank-cell">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}위` }}
            </td>
            <td>{{ user.nickname }}</td>
            <td>{{ user.exp.toLocaleString() }} exp</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PageTitle from '@/components/common/PageTitle.vue'

const allRankings = ref([])
const myRanking = ref(null)

onMounted(async () => {
  try {
    const [rankingRes, myRankingRes] = await Promise.all([
      axios.get('http://localhost:8080/ranking'),
      axios.get('http://localhost:8080/ranking/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
    ])

    allRankings.value = rankingRes.data
    myRanking.value = myRankingRes.data
  } catch (err) {
    console.error('랭킹 정보 조회 실패:', err)
  }
})

</script>

<style scoped>
.ranking-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
}

.my-ranking-box {
  background-color: #fdf5e6;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  font-size: 16px;
}

.my-ranking-box .rank-icon {
  font-weight: bold;
  color: #ff9800;
}

.my-ranking-box .nickname {
  font-weight: 600;
  color: #333;
}

.my-ranking-box .exp {
  font-size: 14px;
  color: #666;
}

.table-wrapper {
  overflow-x: auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
}

.ranking-table thead {
  background-color: #f7f8fa;
}

.ranking-table th,
.ranking-table td {
  padding: 14px 20px;
  text-align: left;
  font-size: 16px;
  border-bottom: 1px solid #eee;
}

.ranking-table th {
  color: #555;
  font-weight: 600;
}

.ranking-table td {
  color: #333;
}

.rank-cell {
  font-weight: bold;
  color: #ff9800;
}

</style>
