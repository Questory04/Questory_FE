<template>
  <div class="detail-container">
    <!-- ✅ 공통 제목 컴포넌트 적용 -->
    <PageTitle :title="post.title" />

    <div class="post-meta">
      <span>작성일: {{ post.createdAt }}</span>
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
import axios from 'axios'
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

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8080/posts/${postId}`)
    post.value = response.data
  } catch (err) {
    console.error('게시글 조회 실패:', err)
    alert('게시글을 불러오는 데 실패했습니다.')
  }
})

const formattedContent = computed(() => post.value.content.split('\n'))

const goBack = () => {
  router.push('/boards')
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
