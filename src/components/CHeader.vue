<template>
  <header class="header">
    <div class="logo">
      <router-link :to="{ name: 'Home' }">
        <img src="@/assets/images/logo.png" />
      </router-link>
    </div>
    View Title
  </header>
</template>

<script>

export default {
  name: 'CHeader'
}
</script>

<style lang="scss" scoped>
header.header {
  text-align: center;
  padding: 20px;
  .logo {
    width: 100px;
    margin: 0px auto;
    img {
      width: 100%;
    }
  }
}
</style>
