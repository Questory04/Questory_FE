<template>
    <AppHeader />
    <router-view />
    <AppFooter />
</template>

<script>
import AppHeader from "@/components/fragments/AppHeader.vue";
import AppFooter from "@/components/fragments/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
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
