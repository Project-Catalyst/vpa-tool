<script setup>
  import { useProfileStore } from '../store/profile.js'
  import { useReviewsStore } from '../store/reviews.js'
    
  const profile = useProfileStore()
  const reviews = useReviewsStore()

</script>

<template>
  <div class="title">{{ $t('profile.TITLE') }}</div>
  <div class="subtitle" v-html="$t('profile.DESCRIPTION')"></div>
  
  <div class="box">
    <profile-content/>
  </div>
  
  <o-field class="buttons is-centered">
    <o-button variant="danger mr-2" @click="deleteProfile()">Delete Profile</o-button>
    <o-button variant="primary" @click="editProfile()">Edit Profile</o-button>
  </o-field>

</template>

<script>
import ProfileContent from '../components/ProfileContent.vue'

export default {
  name: "Profile",
  components: {
    ProfileContent
  },
  data() {
    return {
    }
  },
  methods: {
    deleteProfile() {
      this.profile.resetState()
      this.reviews.resetState()
      this.$router.push({name:"login"})
    },
    editProfile() {
      this.$router.push({name:"login"})
    }
  }
}
</script>

<style scoped>
</style>
