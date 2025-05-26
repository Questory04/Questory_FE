<template>
  <button class="chat-toggle-button" @click="$emit('toggle')">
    💬
  </button>
</template>

<style scoped>
.chat-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #87a6c9; /* 메인 컬러 적용 */
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 9999;
}
</style>
