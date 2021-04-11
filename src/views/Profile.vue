<template>
  <div class="profile">
    <div class="form-wrapper">
      <input placeholder="Name" v-model="name">
      <input placeholder="Email" v-model="email">
    </div>
    <div class="database" v-if="initialized && !localDb">
      <input type="file" @change="readFile" />
      <div class="recap" v-if="csv">
        No of assessments to be loaded: {{csv.data.length}}
        <div class="button" v-if="csv.data.length > 0" @click="importCsv">
          Import local Database
        </div>
      </div>
    </div>
    <div class="database-loaded" v-if="initialized && localDb">
      Database loaded.
      No of assessments: {{assessments.length}}
      <div class="button" @click="clear">Clear Database (!!!)</div>
      <router-link class="button" :to="{ name: 'conditions' }">Start Reviewing</router-link>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      csv: false
    }
  },
  computed: {
    ...mapState({
      initialized: state => state.profile.initialized,
      localDb: state => state.profile.localDb,
      assessments: state => state.assessments.all
    }),
    name: {
      get () {
        return this.$store.state.profile.info.name
      },
      set (value) {
        this.$store.commit('profile/setName', value)
      }
    },
    email: {
      get () {
        return this.$store.state.profile.info.email
      },
      set (value) {
        this.$store.commit('profile/setEmail', value)
      }
    }
  },
  methods: {
    importCsv() {
      if (this.csv) {
        if (this.csv.data) {
          this.$store.commit('profile/setLocalDb', true)
          this.$store.commit('assessments/setAssessments', this.csv.data)
        }
      }
    },
    onComplete(results) {
      this.csv = results;
    },
    readFile() {
      let file = event.target.files[0];
      this.$papa.parse(file, {
        header: true,
        complete: this.onComplete
      });
    },
    clear() {
      this.$store.commit('profile/resetState')
      this.$store.commit('assessments/resetState')
    }
  }
}
</script>
