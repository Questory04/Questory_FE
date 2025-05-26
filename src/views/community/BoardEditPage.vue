<template>
  <div class="write-container">
    <!-- ✅ 공통 제목 컴포넌트 -->
    <PageTitle title="게시글 수정" subtitle="내용을 수정하고 저장할 수 있습니다." />

    <form @submit.prevent="handleUpdate" class="write-form">
      <label>
        제목
        <input type="text" v-model="form.title" required />
      </label>

      <label>
        내용
        <textarea v-model="form.content" rows="10" required></textarea>
      </label>

      <div class="button-row">
        <button type="submit">수정 완료</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()
const route = useRoute()
const postId = route.params.id

const form = ref({
  title: '',
  content: ''
})

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8080/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    form.value.title = response.data.title
    form.value.content = response.data.content
  } catch (error) {
    console.error('게시글 불러오기 실패:', error)
    alert('게시글 정보를 불러오는 데 실패했습니다.')
  }
})

const handleUpdate = async () => {
  try {
    const response = await axios.patch('http://localhost:8080/posts', {
      postId: postId,
      title: form.value.title,
      content: form.value.content
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    alert(response.data.message || '게시글이 수정되었습니다!')
    router.push('/boards') // 게시판 목록으로 이동
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    alert('게시글 수정에 실패했습니다.')
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
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
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
