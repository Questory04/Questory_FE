<template>
  <div>
    <BasicTitle msg="My" color="black" />
    <aside class="my-info">
      <div class="profile-section">
        <div class="profile-image"></div>
        <div class="profile-text">
          <div class="badge">{{ title }}</div>
          <div class="name">{{ nickname }}</div>
        </div>
      </div>

      <div class="level-exp">
        <span class="level">Lv {{ level }}</span>
        <span class="exp">{{ exp }} / {{ maxExp }}</span>
      </div>

      <v-progress-linear
        :model-value="(exp / maxExp) * 100"
        height="6"
        color="#7db4d5"
        rounded
        background-color="#e0e0e0"
      ></v-progress-linear>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BasicTitle from '../common/BasicTitle.vue'

const nickname = ref('')
const title = ref('')
const exp = ref(0)
const level = ref(1)
const maxExp = ref(100)

const calculateLevelInfo = (exp) => {
  if (typeof exp !== 'number' || isNaN(exp)) {
    return { level: 1, maxExp: 100 }
  }
  const level = Math.floor(exp / 100) + 1
  const maxExp = level * 100
  return { level, maxExp }
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    const data = res.data
    console.log('내 정보:', data)  // 응답 확인

    nickname.value = data.nickname ?? '닉네임 없음'
    title.value = data.title ?? '칭호 없음'
    exp.value = typeof data.exp === 'number' ? data.exp : 0

    const { level: lv, maxExp: max } = calculateLevelInfo(exp.value)
    level.value = lv
    maxExp.value = max
  } catch (err) {
    console.error('내 정보 조회 실패:', err)
  }
})

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
