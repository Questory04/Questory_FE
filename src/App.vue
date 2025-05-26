<template>
    <v-app>
        <AppHeader />
        <router-view />
        <ChatToggleButton @toggle="isChatOpen = !isChatOpen" />
        <ChatBot v-if="isChatOpen" @close="isChatOpen = false" />
        <AppFooter />
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/fragments/AppHeader.vue'
import AppFooter from '@/components/fragments/AppFooter.vue'
import ChatBot from '@/components/chatbot/ChatBot.vue'
import ChatToggleButton from '@/components/chatbot/ChatToggleButton.vue'

const isChatOpen = ref(false)
</script>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
