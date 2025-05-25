<template>
  <div class="board-container">
    <!-- ✅ 공통 제목 컴포넌트 -->
    <PageTitle title="공지사항" subtitle="중요한 안내 사항을 확인해보세요!" />

    <div class="table-wrapper">
      <table class="post-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in notices" :key="notice.id">
            <td>{{ notices.length - index }}</td>
            <td class="title-cell">
              <span class="title-text" @click="goToDetail(notice.id)">
                {{ notice.title }}
              </span>
            </td>
            <td>{{ notice.author }}</td>
            <td>{{ notice.createdAt }}</td>
            <td>{{ notice.views }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button>이전</button>
      <button class="active">1</button>
      <button>다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()

const goToDetail = (id) => {
  router.push(`/boards/notice/${id}`)
}

const notices = ref([
  {
    id: 1,
    title: '서비스 점검 안내 (5/30)',
    author: '운영자',
    createdAt: '2025-05-25',
    views: 123
  },
  {
    id: 2,
    title: '이벤트 당첨자 발표',
    author: '운영자',
    createdAt: '2025-05-20',
    views: 98
  }
])
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

.title-cell {
  display: flex;
  align-items: center;
}

.title-text {
  cursor: pointer;
  font-weight: 500;
  color: #000;
  max-width: 100%;
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
