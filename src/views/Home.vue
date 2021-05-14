<template>
  <div class="section container">
    <b-message>
      <p>This is an app to help vCAs with the review process. It's currently in
      early development. Please report any bugs.</p>
    </b-message>

    <b-message type="is-warning" has-icon>
      This tool uses localStorage and cookies to store the progress of your work.<br />
      If you're using a setup where cookies are cleared at every browser launch, be careful because you may lose your work! You should export (download) the file, and re-import it every time or add a exception to your browser's settings.<br />
      We plan to add server authentication mechanism in the future versions to avoid this problem.
    </b-message>

    <b-message type="is-info" has-icon v-if="profile.localDb">
      <p>
        Hello <strong>{{profile.info.name}}</strong>,<br />
        your database is already loaded in the app.<br />
        You can continue your work clicking on the button below.
      </p>

    </b-message>

    <div class="buttons">
      <b-button
        type="is-primary"
        tag="router-link"
        :to="{ name: buttonInfo.link }"
        expanded
      >
        {{ buttonInfo.text }}</b-button
      >
    </div>
    <b-message>
      <p><b>How it works</b><br /></p>
      <p>The vCA-tool is designed to work in parallel with the standard way (using the Google Sheet) in order to provide a better user experience and to better coordinate the vCA work.<br />
      Consider it as an experiment that hopefully will be used as the standard method in the next funds.<br /><br />
      1. From the vCA email you'll receive the Google Sheet link for the vCA Master File: instead of following the standard procedure, save the vCA MAster File as a CSV (File -> Download -> Comma-separated value).<br />
      2. Click on the "Start Process" button, fill the form and upload the file you've just downloaded.<br />
      3. Click "Import data" and the tool will load all the CA assessments in the browser.<br />
      4. After that you will access to the "Assessments list view".<br />
      There are two type of filters: the first one includes "Random", "Low reviewed", "No reviews", "All" and the second one includes "Flagged by proposers", "Proposal", "Question", "Rating", "Length less than", "Length greated than".<br />
      You can combine them in any way you like.<br />
      5. Clicking on the "Next" button, you will access to the "Assessment View" where you can review the assessment flagging the y/r card criteria.<br />
      Unlike what happens with the Google Sheet, here you can see how many times an assessment has been reviewed by the vCAs (Reviews: X): this information is useful to better coordinate the work of the vCAs as you can check if an assessment has reached quorum ( Note: since not everyone will use the vCA tool this information is partial, welcome to the experiment in the experiment).
      6. In the "Assessments list view" you can also click the "Show list" button to see the list of the assessments based on the filters selected.<br />
      7. When you've finished your work, you have to click on top right "vCA Tool" menu and select "Export CSV".<br />
      This is the final file that you'll have to share at the end of the vCA process. This file file can also be re-imported in the vCA-tool.<br /><br /></p>
      <p><b>Useful resources</b><br /></p>
      <p>
        <a href="https://docs.google.com/document/d/1LTw7iY-_XJ5welSUk-olRvkfyVuOIPcR_iAgqbnZv8c/edit">THE YELLOW AND RED CARD THING v2.0</a><br />
        <a href="https://docs.google.com/document/d/1R3il7CjEjp-b_-dXK9jQwgWsyrnAYDzL_i_SHlVsZlM/edit">ASSESS QA (Quality Assurance) stage</a><br />
      </p>


    </b-message>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
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
