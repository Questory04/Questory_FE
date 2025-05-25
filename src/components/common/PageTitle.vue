<template>
  <div class="page-title-block">
    <h2 class="title">{{ title }}</h2>
    <div class="title-underline"></div>
    <p v-if="subtitle" class="description">{{ subtitle }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String
  }
}
</script>

<style scoped>
.page-title-block {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.8rem;
  color: #5a9bd8;
  margin-top: 1rem;
}

.title-underline {
  width: 200px;
  height: 3px;
  background-color: #5a9bd8;
  margin: 0.5rem auto 1.5rem;
}

.description {
  color: #666;
  font-size: 0.95rem;
}
</style>
