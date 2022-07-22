<template>
  <div id="app">
    <b-navbar class="is-primary">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item @click="openInstructions">
          Instructions
        </b-navbar-item>
        <b-navbar-dropdown label="vPA Tool">
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
        <p>Made by Catalyst Community for the Cardano Community</p>
        <p><img class="aim-logo" src="@/assets/images/aim-logo.png" alt="Cardano AIM" /></p>
        <p class="is-size-4 has-text-weight-bold">
          <a href="https://cardanoscan.io/pool/b61f05ec1e907ab9b069eaec6c664056c16f56cab59076109c66d2ae" target="_blank">
            Stake with [AIM] pool
          </a>
        </p>
        <p class="icons">
          <a href="https://github.com/Project-Catalyst/ca-tool" target="_blank">
            <b-icon icon="github" size="small" />
          </a>
          <a href="https://twitter.com/AimCardano" target="_blank">
            <b-icon icon="twitter" size="small" />
          </a>
          <a href="https://t.me/joinchat/Ivl50eWG7r0zODI1" target="_blank">
            <b-icon icon="telegram" size="small" />
          </a>
        </p>
        <b-button
          label="Feedback"
          type="is-primary"
          icon-left="message-reply-text"
          tag="a"
          target="_blank"
          href="https://forms.gle/BUFPVPetPvetpQB5A"
          >
        </b-button>
      </div>
    </footer>
    <b-modal v-model="instructionModal">
      <instructions />
    </b-modal>
  </div>
</template>

<script>
import DownloadMixin from '@/mixins/download'
import Instructions from "@/components/Instructions"

export default {
  data() {
    return {
      instructionModal: false
    }
  },
  mixins: [DownloadMixin],
  components: {
    Instructions
  },
  mounted() {
    if (window.localStorage) {
      let oldKeys = ['vca-tool-f4-default', 'vca-tool-f5-default', 'vca-tool-f6-default', 'vca-tool-f7-default', 'vca-tool-f8-default']
      oldKeys.forEach((k) => {
        let oldKey = window.localStorage.getItem(k)
        if (oldKey) {
          window.localStorage.removeItem(k)
        }
      })
    }
  },
  methods: {
    openInstructions() {
      this.instructionModal = true
    }
  }
};
</script>

<style lang="scss">
.aim-logo {
  width: 150px;
}
</style>
