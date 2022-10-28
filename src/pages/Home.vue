<script setup>
  import { ref } from 'vue'
  import Instructions from '../components/Instructions.vue'

  // ADD PROFILE LOCAL DB
  const profile = ref({
    localDb: true,
    info: {
      name: 'Juliana',
      email: 'jbm@gmail.com'
    }
  })
  
</script>

<template>
  <section>
    <!-- <o-notification v-html="$t('home.STORAGE_WARNING')" -->
    <o-notification 
      class="" type="warning" variant="warning" icon="alert" hasIcon>
      {{ $t('home.STORAGE_WARNING') }}
    </o-notification>

    <div class="title has-text-centered">{{ $t('general.TOOL_TITLE') }}</div>
    <div class="subtitle" v-html="$t('general.TOOL_DESCRIPTION')"></div>

    <o-notification type="info" variant="info" v-if="profile.localDb">
      <p>
        Hello <strong>{{profile.info.name}}</strong>,<br />
        your database is already initialized in the app.<br />
        You can continue your work clicking on the button below.
      </p>
    </o-notification>

    <o-button class="buttons is-centered" variant="primary" size="large"
      tag="router-link"
      :to="{ name: buttonInfo.link }">
        {{ buttonInfo.text }}
    </o-button>

    <instructions/>

  </section>
</template>

<script>
export default {
  name: "Home",
  components: {
    Instructions
  },
  computed: {
    buttonInfo() {
      if (this.profile.localDb) {
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
    },
  }
}
</script>

<style scoped>
</style>
