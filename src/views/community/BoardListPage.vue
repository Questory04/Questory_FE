<template>
  <div class="board-container">
    <!-- 공통 제목 컴포넌트 적용 -->
    <PageTitle title="게시판" subtitle="여러 유저들이 작성한 글을 확인할 수 있는 공간입니다." />

    <!-- 글쓰기 버튼 -->
    <div class="top-bar">
      <button class="write-btn" @click="goToWritePage">✏️ 글쓰기</button>
    </div>

    <!-- 게시글 목록 테이블 -->
    <div class="table-wrapper">
      <table class="post-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="post.id">
            <td>{{ posts.length - index }}</td>
            <td class="title-cell">
              <span class="title-text" @click="goToDetail(post.postId)">
                {{ post.title }}
              </span>
            </td>
            <td>{{ post.nickname }}</td>
            <td>{{ post.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="goToPrevPage">이전</button>
      <button class="active">{{ page + 1 }}</button>
      <button @click="goToNextPage">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue' // 경로에 맞게 import

const router = useRouter()

const goToWritePage = () => {
  router.push('/boards/write')
}

const goToDetail = (id) => {
  router.push(`/boards/${id}`)
}

const posts = ref([])

import axios from 'axios'
import { onMounted } from 'vue'

const page = ref(0)
const size = ref(10)
const keyword = ref('') // 필요하면 검색어도 추가

const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/posts', {
      params: {
        page: page.value,
        size: size.value,
        keyword: keyword.value || undefined, // 비어있으면 보내지 않음
      }
    })
    posts.value = response.data
  } catch (err) {
    console.error('게시글 불러오기 실패:', err)
  }
}

const goToNextPage = () => {
  page.value++
  fetchPosts()
}

const goToPrevPage = () => {
  if (page.value > 0) {
    page.value--
    fetchPosts()
  }
}

onMounted(() => {
  fetchPosts()
})

</script>

<style scoped>
.board-container {
  max-width: 62.5rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.write-btn {
  padding: 0.5rem 1rem;
  background-color: #3d8aff;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.post-table th,
.post-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 0.875rem;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.title-text {
  cursor: pointer;
  font-weight: 500;
  color: #000000;
  max-width: 12.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.pagination button {
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #f0f0f0;
  cursor: pointer;
}

.pagination .active {
  background-color: #3d8aff;
  color: white;
}
</style>
