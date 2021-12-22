<template>
  <div class="section container">
    <b-message type="is-warning" has-icon>
      This tool uses localStorage and cookies to store the progress of your work.<br />
      If you're using a setup where cookies are cleared at every browser launch, be careful because you may lose your work! You should export (download) the file, and re-import it every time or add a exception to your browser's settings.
    </b-message>

    <b-message type="is-info" has-icon v-if="profile.localDb">
      <p>
        Hello <strong>{{profile.info.name}}</strong>,<br />
        your database is already initialized in the app.<br />
        You can continue your work clicking on the button below.
      </p>

    </b-message>

    <div class="buttons is-centered">
      <b-button
        type="is-primary is-large"
        tag="router-link"
        :to="{ name: buttonInfo.link }"
      >
        {{ buttonInfo.text }}</b-button
      >
    </div>
    <instructions />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Instructions from "@/components/Instructions"

export default {
  name: "Home",
  components: {
    Instructions
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile
    }),
    buttonInfo() {
      if (this.profile.localDb) {
        return {
          text: 'Continue Process',
          link: 'conditions'
        }
      } else {
        return {
          text: 'Start Process',
          link: 'profile'
        }
      }
    },
  }
};
</script>
