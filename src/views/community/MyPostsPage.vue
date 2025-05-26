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
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="post.postId">
            <td>{{ posts.length - index }}</td>
            <td class="title-cell">
              <span class="title-text">{{ post.title }}</span>
            </td>
            <td>{{ post.createdAt }}</td>
            <td class="action-cell">
              <button class="edit-btn" @click="editPost(post.postId)">✏ 수정</button>
              <button class="delete-btn" @click="deletePost(post.postId)">🗑 삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageTitle from '@/components/common/PageTitle.vue'

const router = useRouter()
const posts = ref([])

const fetchMyPosts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/posts/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      params: {
        page: 0,
        size: 10,
        keyword: '' // 필요 시 검색어 전달
      }
    })

    console.log('불러온 게시글:', response.data)
    posts.value = response.data
  } catch (error) {
    console.error('내 게시글 조회 실패:', error)
    alert('게시글을 불러오는 데 실패했습니다.')
  }
}

// 컴포넌트 마운트 시 불러오기
onMounted(() => {
  fetchMyPosts()
})

const editPost = async (postId, title, content) => {
  try {
    await axios.patch('http://localhost:8080/posts', {
      postId,
      title,
      content
      // category 등 다른 값도 필요하다면 포함
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    router.push(`/boards/edit/${postId}`)
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    alert('게시글 수정에 실패했습니다.')
  }
}


const deletePost = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      const response = await axios.delete('http://localhost:8080/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        data: {
          postId: id
        }
      })

      console.log('삭제 응답:', response.data)
      alert(response.data?.message || '게시글이 삭제되었습니다.')
      await fetchMyPosts()
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
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
