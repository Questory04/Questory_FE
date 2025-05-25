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
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()
// const route = useRoute()
// const postId = route.params.id

const form = ref({
  title: '',
  content: ''
})

onMounted(() => {
  // TODO: API 연동
  form.value = {
    title: '수정할 게시글 제목',
    content: '수정할 게시글 내용입니다.'
  }
})

const handleUpdate = () => {
  console.log('수정된 게시글:', form.value)
  // TODO: axios.put(`/posts/${postId}`, form.value)
  alert('게시글이 수정되었습니다!')
  router.push('/board')
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
