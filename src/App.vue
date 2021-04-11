<template>
  <div id="app">
    <c-header />
    <router-view class="main-view" />
    <c-footer />
  </div>
</template>

<script>
import CHeader from '@/components/CHeader'
import CFooter from '@/components/CFooter'

export default {
  components: {
    CHeader,
    CFooter
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
#app {
  max-width: 600px;
  width: 100%;
  margin: 0px auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f1f1f1;
  height: 100vh;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  .main-view {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
