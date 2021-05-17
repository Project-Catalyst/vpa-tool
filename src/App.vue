<template>
  <div id="app">
    <b-navbar class="is-primary">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown label="vCA Tool">
          <b-navbar-item tag="router-link" :to="{ name: 'profile' }">
            Profile
          </b-navbar-item>
          <b-navbar-item
            tag="router-link"
            :to="{ name: 'conditions' }"
            v-if="profile.localDb"
          >
            Assessments
          </b-navbar-item>
          <b-navbar-item @click="exportCsv" v-if="profile.localDb">
            Export CSV
          </b-navbar-item>
          <!--<b-navbar-item tag="router-link" :to="{ name: 'stats' }">
            Statistics
          </b-navbar-item>-->
        </b-navbar-dropdown>
      </template>
    </b-navbar>
    <router-view class="main-view" />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>Made by Catalyst Community for the Catalyst Community</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import downloadCsv from "@/utils/export-csv";

export default {
  computed: {
    ...mapState({
      profile: (state) => state.profile,
      assessments: (state) => state.assessments.all
    })
  },
  methods: {
    exportCsv() {
      downloadCsv(this.assessments, this.profile.info.name)
    }
  },
  mounted() {
    if (window.localStorage) {
      let oldKey = window.localStorage.getItem('vca-tool-default')
      if (oldKey) {
        window.localStorage.removeItem('vca-tool-default')
      }
    }
  }
};
</script>
