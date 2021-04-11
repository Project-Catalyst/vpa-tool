<template>
  <div class="home">
    <router-link class="button" :to="{ name: 'profile' }">Start Process</router-link>
    <div class="message">
      This is an app to help vCAs with the review process. It's currently in Early development. Please report any bugs.
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home'
}
</script>
