<template>
  <div class="friend-manager">
    <h2 class="title">나의 친구 관리</h2>
    <p class="subtitle">친구 목록을 확인하고 요청을 수락하거나 차단할 수 있어요.</p>

    <div class="tabs">
      <button :class="{ active: currentTab === 'list' }" @click="setTab('list')">친구 목록</button>
      <button :class="{ active: currentTab === 'request' }" @click="setTab('request')">친구 요청</button>
      <button :class="{ active: currentTab === 'blocked' }" @click="setTab('blocked')">차단 목록</button>
    </div>

    <!-- 친구 목록 -->
    <div v-if="currentTab === 'list'">
      <div class="search-bar">
        <p class="count">현재 친구 수 : {{ friends.length }}명</p>
        <input class="search" v-model="searchQuery" placeholder="닉네임 검색" />
      </div>
      <div class="friend-list">
        <div v-for="friend in filteredFriends" :key="friend.email" class="friend-card">
          <div class="top-content">
            <div class="profile" />
            <div class="user-info">
                <p class="nickname">{{ friend.nickname }}</p>
                <p class="email">{{ friend.email }}</p>
                <p class="level">Lv {{ getLevel(friend.exp) }}</p>
                <p class="badge">{{ friend.title }}</p>
            </div>
          </div>
          <div class="actions-bottom">
            <button class="block">차단하기</button>
            <button class="delete">친구 삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 친구 요청 -->
    <div v-if="currentTab === 'request'">
      <input class="search" v-model="searchEmail" placeholder="이메일 검색" @input="debouncedSearch" />
      <div v-if="searchResults.length" class="friend-list">
      <div v-for="user in searchResults" :key="user.email" class="friend-card">
        <div class="top-content">
          <div class="profile" />
          <div class="user-info">
            <p class="nickname">{{ user.nickname }}</p>
            <p class="email">{{ user.email }}</p>
            <p class="level">Lv {{ getLevel(user.exp || 0) }}</p>
          </div>
        </div>
        <div class="actions-bottom">
          <button class="request" @click="sendFriendRequest(user.email)">친구 요청</button>
        </div>
      </div>
    </div>
      <p v-else-if="searchEmail">검색 결과가 없습니다.</p>

      <div v-if="receivedRequestList.length">
        <h3 class="subtitle">받은 친구 요청 목록</h3>
        <div class="friend-list">
          <div v-for="req in receivedRequestList" :key="req.email" class="friend-card">
            <div class="top-content">
              <div class="profile" />
              <div class="user-info">
                <p class="nickname">{{ req.nickname }}</p>
                <p class="email">{{ req.requesterEmail }}</p>
                <p class="level">Lv {{ getLevel(req.level) }}</p>
              </div>
            </div>
            <div class="actions-bottom">
              <button class="request" @click="updateFriendRequestStatus(req.requesterEmail, 'ACCEPTED')">
                수락
              </button>
              <button class="delete" @click="updateFriendRequestStatus(req.requesterEmail, 'DENIED')">
                거절
              </button>
            </div>
          </div>
        </div>      
      </div>
      <div v-if="requestingList.length">
          <h3 class="subtitle">내가 요청한 친구 목록</h3>
          <div class="friend-list">
            <div v-for="req in requestingList" :key="req.targetEmail" class="friend-card">
              <div class="top-content">
                <div class="profile" />
                <div class="user-info">
                  <p class="nickname">{{ req.targetNickname }}</p>
                  <p class="email">{{ req.targetEmail }}</p>
                </div>
              </div>
              <div class="actions-bottom">
                <button class="delete" @click="cancelFriendRequest(req.targetEmail)">
                  요청 취소
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- 차단 목록 -->
    <div v-if="currentTab === 'blocked'">
      <p class="count">차단한 친구 수 : {{ blockedFriends.length }}명</p>
      <div class="friend-list">
        <div v-for="blocked in blockedFriends" :key="blocked.email" class="friend-card">
          <div class="top-content">
            <div class="profile" />
            <div class="user-info">
              <p class="nickname">{{ blocked.nickname }}</p>
              <p class="email">{{ blocked.email }}</p>
              <p class="level">Lv {{ getLevel(blocked.level) }}</p>
            </div>
          </div>
          <div class="actions-bottom">
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
const searchResults = ref([])

const friends = ref([])
const requestingList = ref([])
const receivedRequestList = ref([])
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
    searchResults.value = []
    fetchFollowRequests()
    fetchSentFriendRequests()
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
    searchResults.value = []
    return
  }

  try {
    const token = authStore.accessToken || localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:8080/friends/search', {
      params: {
        email: searchEmail.value,
        page: 0,
        size: 10
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = res.data
    searchResults.value = data.content || []
  } catch (err) {
    console.error('❌ 유저 검색 실패:', err)
    searchResults.value = []
  }
}, 500)

const fetchFriends = async () => {
  try {
    const token = authStore.accessToken || localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:8080/friends', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    friends.value = res.data
  } catch (err) {
    console.error('❌ 친구 목록을 불러오지 못했습니다:', err)
  }
}

const fetchFollowRequests = async () => {
  try {
    const token = authStore.accessToken || localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:8080/friends/request', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    receivedRequestList.value = res.data
  } catch (err) {
    console.error('❌ 친구 요청 목록 불러오기 실패:', err)
  }
}

const sendFriendRequest = async (targetEmail) => {
  try {
    const token = authStore.accessToken || localStorage.getItem('accessToken')
    const res = await axios.post('http://localhost:8080/friends/request', {
      email: targetEmail
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // ✅ 요청 목록 갱신
    await fetchSentFriendRequests()

    // ✅ 검색 목록에서 제거
    searchResults.value = searchResults.value.filter(user => user.email !== targetEmail)

    // ✅ 받은 요청 목록에서도 제거 (요청자가 나인 경우)
    receivedRequestList.value = receivedRequestList.value.filter(
      req => req.requesterEmail !== targetEmail
    )

    alert(res.data.message || '친구 요청을 보냈어요!')
  } catch (err) {
    console.error('❌ 친구 요청 실패:', err)
    alert(err?.response?.data?.message || '친구 요청 중 오류가 발생했습니다.')
  }
}



const fetchSentFriendRequests = async () => {
  try {
    const token = authStore.accessToken || localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:8080/friends/request/sent', {
      params: {
        page: 0,
        size: 10
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log(requestingList.value);
    console.log('응답 확인:', res.data)

    requestingList.value = res.data.content || []
  } catch (err) {
    console.error('❌ 보낸 친구 요청 목록 로딩 실패:', err)
    requestingList.value = []
  }
}


const cancelFriendRequest = async (targetEmail) => {
  try {
    const token = localStorage.getItem('accessToken')

    const res = await axios.delete('http://localhost:8080/friends/request', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        email: targetEmail
      }
    })

    await fetchSentFriendRequests()
    await debouncedSearch()

    alert(res.data.message || '친구 요청이 취소되었습니다!')
  } catch (err) {
    console.error('❌ 친구 요청 취소 실패:', err)
    alert(err?.response?.data?.message || '친구 요청 취소 중 오류가 발생했습니다.')
  }
}

const updateFriendRequestStatus = async (requesterEmail, status) => {
  try {
    const token = authStore.accessToken || localStorage.getItem('accessToken')

    const res = await axios.patch('http://localhost:8080/friends/request', {
      requesterEmail: requesterEmail,
      status: status
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    alert(res.data.message || '친구 요청 상태가 업데이트되었습니다.')

    // 요청 목록 갱신
    await fetchFollowRequests()
    await fetchSentFriendRequests()
    await fetchFriends()
  } catch (err) {
    console.error('❌ 친구 요청 상태 변경 실패:', err)
    alert(err?.response?.data?.message || '친구 요청 상태 변경 중 오류가 발생했습니다.')
  }
}

onMounted(fetchFriends)

</script>

<style scoped>
.friend-manager {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #555;
  margin: 1.5rem;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tabs button {
  padding: 0.5rem 1.25rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
}

.tabs button.active {
  background: #3399dd;
  color: white;
  border: none;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin: 1rem;
}

.count {
  font-weight: bold;
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
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 140px;
}

.top-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile {
  width: 60px;
  height: 60px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #eee;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: left;
}

.nickname {
  font-weight: bold;
}

.email, .level {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.actions-bottom {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.actions-bottom button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
}

.block {
  background: #ff6666;
  color: white;
}

.delete {
  background: #ccc;
  color: black;
}

.request {
  background: #3399dd;
  color: white;
}

@media (max-width: 768px) {
  .friend-card {
    flex: 1 1 100%;
  }
}
</style>
