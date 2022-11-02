<script setup>
import { ref } from 'vue'
import { useProfileStore } from '../store/profile.js'
import { useReviewsStore } from '../store/reviews.js'
  
const profile = useProfileStore()
const reviews = useReviewsStore()
const name = ref(profile.info.name)
const email = ref(profile.info.email)

const isEdition = profile.initialized

</script>

<template>
  <section class="section">
    <div class="title"><b>User Login</b></div>
    <div class="subtitle">Fill up your information.</div>
    
    <o-field label="Full Name">
      <o-input v-model="name" placeholder="full name" icon="user" required></o-input>
    </o-field>
    <o-field label="Email">
      <o-input v-model="email" type="email" placeholder="e-mail" icon="envelope" required></o-input>
    </o-field>

    <o-field>
      <template #label>
        Import previous reviews by uploading a vPA process backup file (optional)
        <o-tooltip label="Upload a csv file from previous process on the vPA-Tool or from the Google Sheet vPA interface to incorporate your previous work to the process."
          position="right"
          size="large"
          multiline>
            <o-icon icon="information"></o-icon>
        </o-tooltip>
      </template>
      <o-upload v-if="!backupFile" v-model="backupFile" drag-drop expanded>
        <div class="content has-text-centered">
          <p><o-icon icon="upload" size="is-large"></o-icon></p>
          <p>Drop your vPA-progress backup file here or click to upload</p>
        </div>
      </o-upload>
      <o-notification v-if="backupFile" closable @close="deleteDropFile()">
        <b>Upload file:</b> {{ backupFile.name }}
      </o-notification>
    </o-field>

    <div v-if="reviews.initialized">
      <o-field label="Imported backup file">
        <o-notification variant="success">
          <p> You have loaded previous process into the application.</p>
          <b>Imported file:</b> {{ reviews.file }}
          <o-button variant="danger" size="small" @click="clearReviews()">Clear local database</o-button>
        </o-notification>
      </o-field>
    </div>

    <!-- reviewsStore not initialized -->
    <div v-if="reviews.initialized && hasBackupFile">
      <o-notification variant="warning">
        <p>To upload new backup file will erase all previous information already loaded.</p>
        <p><b>Be careful, this operation is not reversible!</b></p>
      </o-notification>
    </div>

    <o-button class="buttons is-centered columns column is-half is-offset-one-quarter" 
      variant="primary" size="large"
      :disabled="!canLogin"
      @click="login()">
      {{ btnProceedMsg }}
    </o-button>

  </section>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      backupFile: null,
    }
  },
  mounted() {
  },
  computed: {
    isValidEmail() {
      if(this.email.length > 0 ) {
        return this.email.includes("@")
      }
      else { return false }
    },
    canLogin() {
      return this.name.length > 0 && this.isValidEmail
    },
    hasBackupFile() {
      return (this.backupFile === null)
      ? false
      : true
    },
    btnProceedMsg() {
      return (this.isEdition)
      ? "Save changes" 
      : "Login and proceed"
    }
  },
  methods: {
    login() {
      if(this.backupFile !== null) {
        this.setReviewsStore()
      }
      this.setProfileStore()
      this.nextPage()
    },
    nextPage() {
      (this.isEdition)
      ? this.$router.push({name: "profile"})
      : this.$router.push({name: "search"})
    },
    deleteDropFile() {
      this.backupFile = null
    },
    setProfileStore() {
      this.profile.init(this.name, this.email)
    },
    setReviewsStore() {
      this.reviews.init(this.backupFile.name)
    },
    clearReviews() {
      this.reviews.resetState()
    }
  }
}
</script>


<style scoped>
</style>
