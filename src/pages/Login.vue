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
      <o-upload v-if="!hasBackupFile" @update:modelValue="loadFile" drag-drop expanded accept=".csv">
        <div class="content has-text-centered">
          <p><o-icon icon="upload" size="is-large"></o-icon></p>
          <p>Drop your vPA-progress backup file here or click to upload</p>
        </div>
      </o-upload>
      <o-notification v-if="hasBackupFile && !reviews.hasReviews" closable @close="deleteDropFile()">
        <b>Upload file:</b> {{ backupFile.name }}
      </o-notification>
      <o-notification v-if="hasBackupFile && reviews.hasReviews" closable @close="deleteDropFile()" variant="warning" class="mb-2">
        <b>Upload file:</b> {{ backupFile.name }}
        <p><br/><b>WARNING: YOU HAVE STORED ON-GOING PROCESS</b></p>
        <p>To upload new backup file will erase <u>all the work currently stored in the application.</u></p>
        <p><em>Be careful, this operation is not reversible!</em></p>
      </o-notification>
    </o-field>

    <div v-if="reviews.hasImportedFile">
      <o-field label="Imported backup file">
        <o-notification variant="success" class="is-light">
          <p><b> You have loaded previous process into the application.</b></p>
          <b>Imported file:</b> {{ reviews.file }}
        </o-notification>
      </o-field>
    </div>

    <o-button class="buttons is-centered columns column is-half is-offset-one-quarter mt-5" 
      variant="primary" size="large"
      :disabled="!canLogin"
      @click="login()">
      {{ btnProceedMsg }}
    </o-button>

  </section>
</template>

<script>
import {readFile} from '../utils/import_csv.js'

export default {
  name: "Login",
  data() {
    return {
      backupFile: null,
      importedData: []
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
        this.reviews.initializeFromFile(this.backupFile.name, this.importedData)
      }
      this.profile.init(this.name, this.email)
      this.nextPage()
    },
    nextPage() {
      (this.isEdition)
      ? this.$router.push({name: "profile"})
      : this.$router.push({name: "search", params: {page: 1} })
    },
    async loadFile(file) {
      this.backupFile = file
      this.importedData = await this.readFile(file)
    },
    deleteDropFile() {
      this.backupFile = null
      this.importedData = []
    },
    clearReviews() {
      this.reviews.resetState()
    }
  }
}
</script>


<style scoped>
</style>
