<template>
  <div class="chat-popup">
    <div class="chat-header">
      <strong>여행 퀘스트 챗봇</strong>
      <button @click="$emit('close')">✖️</button>
    </div>

    <div class="chat-body">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['bubble-container', msg.role]"
      >
        <div class="profile-icon" v-if="msg.role === 'assistant'">🤖</div>
        <div class="bubble" :class="msg.role">{{ msg.content }}</div>
        <div class="profile-icon" v-if="msg.role === 'user'">🙂</div>
      </div>
    </div>

    <form class="chat-input" @submit.prevent="sendMessage">
      <input v-model="userInput" placeholder="질문해보세요!" />
      <button type="submit">▶</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const messages = ref([{ role: 'assistant', content: '어서오세요! 퀘스트 도우미입니다!' }])
const userInput = ref('')

const sendMessage = async () => {
  const content = userInput.value
  messages.value.push({ role: 'user', content })
  userInput.value = ''

  try {
    const res = await axios.post('http://localhost:8080/chat', {
      message: content,
    })
    messages.value.push({ role: 'assistant', content: res.data.response })
  } catch {
    messages.value.push({ role: 'assistant', content: '⚠️ 응답 실패! 다시 시도해주세요.' })
  }
}
</script>

<style scoped>
.chat-popup {
  position: fixed;
  bottom: 5vh;
  right: 2vw;
  width: 80vw;          /* 살짝 줄임 */
  max-width: 420px;      /* 최대 너비 줄임 */
  height: 65vh;          /* 살짝 줄임 */
  max-height: 520px;     /* 최대 높이 줄임 */
  background: white;
  border: 1px solid #ccc;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-size: 1rem;
}
/* 헤더 */
.chat-header {
  padding: 1em;
  background-color: #87a6c9;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  font-weight: bold;
}

/* 본문 */
.chat-body {
  flex: 1;
  padding: 1em;
  overflow-y: auto;
  background: #f6f9fc;
  display: flex;
  flex-direction: column;
  gap: 0.75em;
}

/* 메시지 정렬용 컨테이너 */
.bubble-container {
  display: flex;
  align-items: flex-start;
}

.bubble-container.user {
  justify-content: flex-end;
}

.bubble-container.assistant {
  justify-content: flex-start;
}

/* 이모지 아이콘 */
.profile-icon {
  font-size: 1.25rem;
  margin: 0 0.5em;
  align-self: flex-end;
}

/* 공통 말풍선 스타일 */
.bubble {
  padding: 0.75em 1em;
  max-width: 75%;
  border-radius: 1.25rem;
  line-height: 1.5;
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 1rem;
}

/* GPT 응답 말풍선 */
.bubble.assistant {
  background-color: #ffffff;
  border: 1px solid #d1dbe8;
  color: #2c3e50;
}

/* 사용자 말풍선 */
.bubble.user {
  background-color: #87a6c9;
  color: white;
}

/* 입력창 */
.chat-input {
  display: flex;
  padding: 0.75em;
  border-top: 1px solid #ccc;
  background-color: white;
  gap: 0.5em;
}

.chat-input input {
  flex: 1;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
}

.chat-input button {
  background: #87a6c9;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

</style>

