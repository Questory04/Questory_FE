<template>
  <div class="board-container">
    <!-- ✅ 공통 제목 컴포넌트 -->
    <PageTitle title="내 게시글" subtitle="내가 작성한 게시글을 관리할 수 있습니다." />

    <div class="table-wrapper">
      <table class="post-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>날짜</th>
            <th>조회수</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="post.id">
            <td>{{ posts.length - index }}</td>
            <td class="title-cell">
              <span class="title-text">{{ post.title }}</span>
            </td>
            <td>{{ post.createdAt }}</td>
            <td>{{ post.views }}</td>
            <td class="action-cell">
              <button class="edit-btn" @click="editPost(post.id)">✏ 수정</button>
              <button class="delete-btn" @click="deletePost(post.id)">🗑 삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()

const posts = ref([
  {
    id: 1,
    title: '서울 여행 후기',
    createdAt: '2025-05-24',
    views: 30
  },
  {
    id: 2,
    title: 'Vue3 팁 정리',
    createdAt: '2025-05-20',
    views: 42
  }
])

const editPost = (id) => {
  router.push(`/board/edit/${id}`)
}

const deletePost = (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    posts.value = posts.value.filter(post => post.id !== id)
    alert('삭제되었습니다.')
  }
}
</script>

<style scoped>
.board-container {
  max-width: 62.5rem;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.title-cell .title-text {
  font-weight: 500;
  color: #333;
}

.action-cell {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.edit-btn {
  background-color: #3d8aff;
  color: white;
}

.delete-btn {
  background-color: #ff5c5c;
  color: white;
}
</style>
