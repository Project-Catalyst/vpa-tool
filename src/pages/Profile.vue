<script setup>
  import { useProfileStore } from '../store/modules/profile.js'
  import { useReviewsStore } from '../store/modules/reviews.js'
    
  const profile = useProfileStore()
  const reviews = useReviewsStore()

</script>

<template>
  <div class="title">{{ $t('profile.TITLE') }}</div>
  <div class="subtitle" v-html="$t('profile.DESCRIPTION')"></div>
  
  <div class="box">
    <profile-content/>
  </div>

  <o-button variant="danger" @click="deleteProfile()">Delete Profile</o-button>
  <o-button variant="primary" @click="editProfile()">Edit Profile</o-button>

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
