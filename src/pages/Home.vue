<script setup>
  import { useProfileStore } from '../store/modules/profile.js'

  const profile = useProfileStore()

</script>

<template>
  <section>
    <o-notification 
      class="" type="warning" variant="warning" icon="alert" hasIcon>
      {{ $t('home.STORAGE_WARNING') }}
    </o-notification>

    <div class="title has-text-centered">{{ $t('general.TOOL_TITLE') }}</div>
    <div class="subtitle" v-html="$t('general.TOOL_DESCRIPTION')"></div>

    <o-notification type="info" variant="info" v-if="profile.initialized">
      <p>
        Hello <strong>{{profile.info.name}}</strong>,<br />
        your database is already initialized in the app.<br />
        You can continue your work clicking on the button below.
      </p>
    </o-notification>

    <o-button class="buttons is-centered columns column is-half is-offset-one-quarter" 
      variant="primary" size="large"
      tag="router-link" :to="{name: buttonInfo.link}">
        {{ buttonInfo.text }}
    </o-button>

    <instructions/>

  </section>
</template>

<script>
import Instructions from '../components/Instructions.vue'

export default {
  name: "Home",
  components: {
    Instructions
  },
  computed: {
    buttonInfo() {
      if (this.profile.initialized) {
        return {
          text: 'Continue vPA-Tool Process',
          link: 'search'
        }
      } else {
        return {
          text: 'Start vPA-Tool Process',
          link: 'login'
        }
      }
    },
  }
}
</script>

<style scoped>
</style>
