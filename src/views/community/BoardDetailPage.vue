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
      <button @click="goBack">← 목록으로</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'

const route = useRoute()
const router = useRouter()

const postId = route.params.id

const post = ref({
  id: postId,
  title: '',
  content: '',
  createdAt: '',
  views: 0
})

onMounted(() => {
  // TODO: axios.get(`/posts/${postId}`) 로 대체
  post.value = {
    id: postId,
    title: '게시글 제목입니다',
    content: '이곳에 본문 내용이 들어갑니다.\n줄바꿈도 표현됩니다.',
    createdAt: '2025-05-25',
    views: 32
  }
})

const formattedContent = computed(() => post.value.content.split('\n'))

const goBack = () => {
  router.push('/board')
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
  background-color: #f9f9f9;
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
