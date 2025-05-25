<template>
  <div class="detail-container">
    <!-- ✅ 공통 제목 컴포넌트 적용 -->
    <PageTitle :title="post.title" />

    <div class="post-meta">
      <span>작성일: {{ post.createdAt }}</span>
      <span>조회수: {{ post.views }}</span>
    </div>

    <div class="post-content">
      <p v-for="(line, index) in formattedContent" :key="index">
        {{ line }}
      </p>
    </div>

    <div class="button-row">
      <button @click="goBack">← 공지 목록으로</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'

const route = useRoute()
const router = useRouter()
const noticeId = route.params.id

const post = ref({
  id: noticeId,
  title: '',
  content: '',
  createdAt: '',
  views: 0
})

onMounted(() => {
  // TODO: API 연동으로 대체 예정
  post.value = {
    id: noticeId,
    title: '서비스 점검 안내 (5/30)',
    content: '안녕하세요, 사용자 여러분.\n5월 30일(목) 오전 2시부터 4시까지 서비스 점검이 예정되어 있습니다.\n이용에 참고 부탁드립니다.',
    createdAt: '2025-05-25',
    views: 342
  }
})

const formattedContent = computed(() => post.value.content.split('\n'))

const goBack = () => {
  router.push('/notice')
}
</script>

<style scoped>
.detail-container {
  max-width: 60rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.post-meta {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.post-content {
  font-size: 1rem;
  line-height: 1.75;
  color: #222;
  background-color: #fefae0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  white-space: pre-wrap;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.button-row button {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  background-color: #ccc;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
</style>
