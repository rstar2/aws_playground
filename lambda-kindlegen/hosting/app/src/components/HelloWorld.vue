<template>
<div>
    <h1>{{ msg }}</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">
    count is: {{ count }}
  </button>
</div>

</template>

<script>
export default {
    props: {
        msg: String
    },
    data() {
        return {
            count: 0
        }
    }
}
</script>>

<style scoped>
a {
  color: #42b983;
}
</style>
