<template>
    <AppHeader />
    <router-view />
</template>

<script>
import AppHeader from "@/components/fragments/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },
};
</script>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
