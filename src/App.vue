<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  
  import { useProgrammatic } from '@oruga-ui/oruga-next'
  import Instructions from './components/Instructions.vue'
  import { useProfileStore } from './store/profile.js'
  import { useFilterStore } from './store/filters.js'
  import { useReviewsStore } from './store/reviews.js';

  const { oruga } = useProgrammatic()
  const profile = useProfileStore()

  const filters = useFilterStore()
  if(!filters.initialized) {
    filters.init()
  }

  const reviews = useReviewsStore();
  reviews.assureReviewingConsistency()

  function openInstructions() {
    oruga.modal.open({
      component: Instructions,
      trapFocus: false
    })
  }
</script>

<template>
  <div id="app">
    <nav class="navbar is-primary is-fixed-top">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="./assets/images/catalyst.png" alt="Project Catalyst" width="112" height="28">
        </a>
      </div>
      <div class="navbar-start">
        <timer></timer>
      </div>
      <div class="navbar-end">
        <a class="navbar-item" @click="openInstructions()"> Instructions </a>
        <router-link class="navbar-item" :to="{name: 'login'}" v-if="!profile.initialized"> Login </router-link>
        <router-link class="navbar-item" :to="{name: 'search', params: {page: 1}}" v-if="profile.initialized"> Search Assessments </router-link>
        <div class="navbar-item has-dropdown is-hoverable" v-if="profile.initialized">
          <a class="navbar-link">
            User Info
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item">
              <router-link :to="{name: 'profile'}"> Profile </router-link>
            </a>
            <a class="navbar-item">
              <router-link :to="{name: 'store'}"> Store </router-link>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
    <!-- FOOTER -->
    <footer class="footer">
      <div class="content has-text-centered">
        <p>Made by Catalyst Community for the Cardano Community</p>
        <img class="aim-logo" src="./assets/images/aim-logo.png" alt="Catalyst AIM Group">
        
        <p class="is-size-4 has-text-weight-bold">
          <a href="https://cardanoscan.io/pool/b61f05ec1e907ab9b069eaec6c664056c16f56cab59076109c66d2ae" target="_blank">
            Stake with [AIM] pool
          </a>
        </p>
        <p class="icons">
          <a href="https://github.com/Project-Catalyst/ca-tool" target="_blank">
            <o-icon pack="mdi" icon="github" size="medium"></o-icon>
          </a>
          <a href="https://twitter.com/AimCardano" target="_blank">
            <o-icon icon="twitter" size="medium"></o-icon>
          </a>
          <a href="https://t.me/joinchat/Ivl50eWG7r0zODI1" target="_blank">
            <o-icon icon="telegram" size="medium"></o-icon>
          </a>
        </p>
        <o-button
          label="Feedback"
          variant="primary"
          icon-left="message-reply-text"
          tag="a"
          target="_blank"
          href="https://forms.gle/BUFPVPetPvetpQB5A"
          >
        </o-button>
      </div>
    </footer>
  </div>
</template>

<script>
import Timer from "./components/Timer.vue";

export default {
  name: "App",
  components: {
    Timer
  },
  data(){
    return {
    }
  },
}
</script>

<style scoped>
.aim-logo {
  width: 150px;
}
</style>
