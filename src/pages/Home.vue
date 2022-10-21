<script setup>
  import { ref } from 'vue'
  import Instructions from '../components/Instructions.vue'

  // ADD PROFILE LOCAL DB
  const profile = ref(false)
  
  function buttonInfo() {
    if (profile) { // if (this.profile.localDb)
      return {
        text: 'Continue Process',
        link: 'search'
      }
    } else {
      return {
        text: 'Start Process',
        link: 'profile'
      }
    }
  }
</script>

<template>
  <section>
    <o-notification class="" type="warning" variant="warning" icon="alert" hasIcon>
      This tool uses localStorage and cookies to store the progress of your work.<br />
      If you're using a setup where cookies are cleared at every browser launch, be careful because you may lose your work! You should export (download) the file, and re-import it every time or add a exception to your browser's settings.
    </o-notification>
    <!-- <b-message type="is-warning" has-icon>
      This tool uses localStorage and cookies to store the progress of your work.<br />
      If you're using a setup where cookies are cleared at every browser launch, be careful because you may lose your work! You should export (download) the file, and re-import it every time or add a exception to your browser's settings.
    </b-message> -->

    <o-notification type="info" variant="info">
      <p>
        Hello <strong>profile.info.name</strong>,<br />
        your database is already initialized in the app.<br />
        You can continue your work clicking on the button below.
      </p>
    </o-notification>
    <!-- <b-message type="is-info" has-icon v-if="profile.localDb">
      <p>
        Hello <strong>{{profile.info.name}}</strong>,<br />
        your database is already initialized in the app.<br />
        You can continue your work clicking on the button below.
      </p>
    </b-message> -->

    <!-- <div class="buttons is-centered"> -->
      <o-button variant="primary" size="large"
        tag="router-link"
        :to="{ name: buttonInfo().link }">
        {{ buttonInfo().text }}
      </o-button>
      <!-- <b-button
        type="is-primary is-large"
        tag="router-link"
        :to="{ name: buttonInfo.link }"
      >
        {{ buttonInfo.text }}</b-button
      > -->
    <!-- </div> -->

    <div class="title">VPA TOOL</div>
    <div class="subtitle">vPA Tool is a part of the AIM Community Tool series developed by the community for the community. It is designed to assist the Veteran Community Advisors to review the Cardano Project Catalyst assessments.</div>
    <instructions/>
  </section>
</template>

<style scoped>
</style>
