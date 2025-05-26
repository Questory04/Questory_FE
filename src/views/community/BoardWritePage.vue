<template>
  <div class="write-container">
    <!-- ✅ 공통 제목 컴포넌트 적용 -->
    <PageTitle title="게시글 작성" subtitle="제목과 내용을 입력하고 글을 작성해보세요." />

    <form @submit.prevent="handleSubmit" class="write-form">
      <label>
        제목
        <input type="text" v-model="form.title" required />
      </label>

      <label>
        내용
        <textarea v-model="form.content" rows="8" required></textarea>
      </label>

      <div class="button-row">
        <button type="submit">등록</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue' // 공통 제목 컴포넌트 import

const router = useRouter()

const form = ref({
  title: '',
  content: ''
})

import axios from 'axios'

const handleSubmit = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/posts', 
      form.value,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // JWT 토큰
          'Content-Type': 'application/json'
        }
      }
    )

    alert(response.data.message) // "글이 등록되었습니다."
    router.push('/boards') // 작성 완료 후 목록으로 이동
  } catch (error) {
    console.error('게시글 작성 실패:', error)
    alert('게시글 작성에 실패했습니다.')
  }
}

</script>

<style scoped>
.write-container {
  width: 40rem;
  max-width: 60rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.write-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.write-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #333;
}

.write-form input,
.write-form textarea {
  margin-top: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.button-row {
  display: flex;
  justify-content: flex-end;
}

.button-row button {
  padding: 0.5rem 1.25rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #3d8aff;
  color: white;
  cursor: pointer;
}
</style>
