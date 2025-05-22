<template>
  <div class="friend-manager">
    <h2 class="title">나의 친구 관리</h2>
    <p class="subtitle">친구 목록을 확인하고 요청을 수락하거나 차단할 수 있어요.</p>

    <div class="tabs">
      <button :class="{ active: currentTab === 'list' }" @click="setTab('list')">친구 목록</button>
      <button :class="{ active: currentTab === 'request' }" @click="setTab('request')">친구 요청</button>
      <button :class="{ active: currentTab === 'blocked' }" @click="setTab('blocked')">차단 목록</button>
    </div>

    <!-- 친구 목록 탭 -->
    <div v-if="currentTab === 'list'">
      <div class="search-bar">
        <p class="count">현재 친구 수 : {{ friends.length }}명</p>
        <input class="search" v-model="searchQuery" placeholder="닉네임 검색" />
      </div>
      <div class="friend-list">
        <div v-for="friend in filteredFriends" :key="friend.email" class="friend-card">
          <div class="profile" />
          <div>
            <p class="nickname">{{ friend.nickname }}</p>
            <p class="email">{{ friend.email }}</p>
            <p class="level">Lv {{ getLevel(friend.level) }}</p>
          </div>
          <div class="actions">
            <button class="block">차단하기</button>
            <button class="delete">친구 삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 친구 요청 탭 -->
    <div v-if="currentTab === 'request'">
      <input class="search" v-model="searchEmail" placeholder="이메일 검색" @input="debouncedSearch" />
      <div v-if="searchResult" class="friend-card">
        <div class="profile" />
        <div>
          <p class="nickname">{{ searchResult.nickname }}</p>
          <p class="email">{{ searchResult.email }}</p>
          <p class="level">Lv {{ getLevel(searchResult.level) }}</p>
        </div>
        <div class="actions">
          <button class="request">친구 요청</button>
        </div>
      </div>
      <p v-else-if="searchEmail">검색 결과가 없습니다.</p>

      <div class="requesting-list" v-if="requestingList.length">
        <h3 class="subtitle">내가 요청한 친구 목록</h3>
        <div class="friend-list">
          <div v-for="req in requestingList" :key="req.email" class="friend-card">
            <div class="profile" />
            <div>
              <p class="nickname">{{ req.nickname }}</p>
              <p class="email">{{ req.email }}</p>
              <p class="level">Lv {{ getLevel(req.level) }}</p>
            </div>
            <div class="actions">
              <button class="delete">요청 취소</button>
            </div>
          </div>
        </div>
      </div>

      <div class="requesting-list" v-if="receivedRequestList.length">
        <h3 class="subtitle">받은 친구 요청 목록</h3>
        <div class="friend-list">
          <div v-for="req in receivedRequestList" :key="req.email" class="friend-card">
            <div class="profile" />
            <div>
              <p class="nickname">{{ req.nickname }}</p>
              <p class="email">{{ req.email }}</p>
              <p class="level">Lv {{ getLevel(req.level) }}</p>
            </div>
            <div class="actions">
              <button class="request">수락</button>
              <button class="delete">거절</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 차단 목록 탭 -->
    <div v-if="currentTab === 'blocked'">
      <p class="count">차단한 친구 수 : {{ blockedFriends.length }}명</p>
      <div class="friend-list">
        <div v-for="blocked in blockedFriends" :key="blocked.email" class="friend-card">
          <div class="profile" />
          <div>
            <p class="nickname">{{ blocked.nickname }}</p>
            <p class="email">{{ blocked.email }}</p>
            <p class="level">Lv {{ getLevel(blocked.level) }}</p>
          </div>
          <div class="actions">
            <button class="delete">차단 해제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentTab = ref('list')
const searchQuery = ref('')
const searchEmail = ref('')
const searchResult = ref(null)

const friends = ref([])

const requestingList = ref([
  { nickname: '보낸요청1', email: 'sent1@example.com', level: 210 },
  { nickname: '보낸요청2', email: 'sent2@example.com', level: 140 }
])

const receivedRequestList = ref([
  { nickname: '받은요청1', email: 'recv1@example.com', level: 320 },
  { nickname: '받은요청2', email: 'recv2@example.com', level: 80 }
])

const blockedFriends = ref([
  { nickname: '차단친구', email: 'blocked@example.com', level: 150 }
])

const getLevel = (exp) => {
  const value = typeof exp === 'number' ? exp : Number(exp)
  return isNaN(value) ? 0 : Math.floor(value / 100)
}

const setTab = (tab) => {
  currentTab.value = tab
  if (tab === 'request') {
    searchEmail.value = ''
    searchResult.value = null
  }
}

const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value
  return friends.value.filter(f =>
    f.nickname.includes(searchQuery.value)
  )
})

const debouncedSearch = debounce(async () => {
  if (!searchEmail.value) {
    searchResult.value = null
    return
  }
  if (searchEmail.value === 'user@example.com') {
    searchResult.value = {
      nickname: '닉네임',
      email: 'user@example.com',
      level: 160
    }
  } else {
    searchResult.value = null
  }
}, 500)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/friends', {
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`
        }
    })
    friends.value = res.data
  } catch (err) {
    console.error('친구 목록을 불러오지 못했습니다:', err)
  }
})
</script>




<style scoped>
.friend-manager {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #3399dd;
  margin-bottom: 1rem;
}
.subtitle {
  color: #666;
  margin: 2rem 0 1rem;
}
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.tabs button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 20px;
  cursor: pointer;
}
.tabs button.active {
  background: #3399dd;
  color: white;
  border: none;
}
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.count {
  font-weight: bold;
  margin: 1rem;
}
.search {
  width: 60%;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  min-width: 250px;
  margin: 1rem;
}
.friend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem 1.5rem;
  justify-content: space-between;
}
.friend-card {
  flex: 0 0 calc(50% - 0.75rem);
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1.5rem 1rem;
  text-align: left;
  display: flex;
  gap: 1rem;
  align-items: center;
  box-sizing: border-box;
}
.profile {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #eee;
}
.nickname {
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.email, .level {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}
.actions {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.actions button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.actions .block {
  background: #ff6666;
  color: white;
}
.actions .delete {
  background: #ccc;
  color: black;
}
.actions .request {
  background: #3399dd;
  color: white;
}

@media (max-width: 768px) {
  .friend-card {
    flex: 1 1 100%;
  }
  .search-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .search {
    width: 100%;
  }
}
</style>