<script setup>
import { ref } from 'vue'
import { useProfileStore } from '../store/profile.js'
import { useReviewsStore } from '../store/reviews.js'
  
const profile = useProfileStore()
const reviews = useReviewsStore()

</script>

<template>
  <section class="section">

    <div class="subtitle">Welcome,</div>
    
    <o-field label="Full Name">
      <o-input v-model="profile.info.name" icon="user" hasIcon disabled></o-input>
    </o-field>

    <o-field label="Email">
      <o-input v-model="profile.info.email" icon="envelope" hasIcon disabled></o-input>
    </o-field>

    <o-field label="Imported backup file">
      <o-notification v-if="reviews.hasImportedFile" variant="success" class="is-light">
        <p><b> You have loaded previous process into the application.</b></p>
        <b>Imported file:</b> {{ reviews.file }}
      </o-notification>
      <o-notification v-else>
        <p>No previous process imported to the application.</p>
        <b>To import a backup file, click to edit the Profile.</b>
      </o-notification>
    </o-field>

  </section>
</template>

<script>

export default {
  name: "ProfileContent",
  methods: {
  }
}
</script>


<style scoped>
</style>
