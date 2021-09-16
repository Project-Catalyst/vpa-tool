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
      <div class="content">
        <p><b>How it works</b><br /></p>
        <p>The vCA-tool is designed to work in parallel with the standard way (using the Google Sheet) in order to provide a better user experience and to better coordinate the vCA work.<br />
        Consider it as an experiment that hopefully will be used as the standard method in the next funds.<br /><br /></p>
        <ol>
          <li>
            From the vCA email you'll receive the Google Sheet link for the vCA Master File: instead of following the standard procedure, save the vCA MAster File as a CSV (File -> Download -> Comma-separated value).
          </li>
          <li>
            Click on the "Start Process" button, fill the form and upload the file you've just downloaded.<br />
          </li>
          <li>
            Click "Import data" and the tool will load all the CA assessments in the browser.<br />
          </li>
          <li>
            After that you will access to the "Assessments list view".<br />
            There are two type of filters: the first one includes "Random", "Low reviewed", "No reviews", "All" and the second one includes "Flagged by proposers", "Proposal", "Question", "Rating", "Length less than", "Length greated than".<br />
            You can combine them in any way you like.<br />
          </li>
          <li>
            Clicking on the "Next" button, you will access to the "Assessment View" where you can review the assessment flagging the y/r card criteria.<br />
            Unlike what happens with the Google Sheet, here you can see how many times an assessment has been reviewed by the vCAs (Reviews: X): this information is useful to better coordinate the work of the vCAs as you can check if an assessment has reached quorum ( Note: since not everyone will use the vCA tool this information is partial, welcome to the experiment in the experiment).
          </li>
          <li>
            In the "Assessments list view" you can also click the "Show list" button to see the list of the assessments based on the filters selected.<br />
          </li>
          <li>
            When you've finished your work, you have to click on top right "vCA Tool" menu and select "Export CSV".<br />
          </li>
        </ol>
        <p>This is the final file that you'll have to share at the end of the vCA process. This file file can also be re-imported in the vCA-tool.<br />
        Upload the final export to Google Docs, change the share settings to "Anyone with the link", send the link in the <a href="https://t.me/CatalystCommunityAdvisors">Telegram Community Advisor Chat</a>, tag Marek Buchowiecki (@Marklar_IO) and fill in <a href="#">this form</a> with your details.<br /></p>
        <p><b>Useful resources</b><br /></p>
        <p>
          <a href="https://docs.google.com/document/d/1vHapUV1LHM4cb2375V99oM32xJ-wj_XoN-DYcvKEk0A/edit?usp=sharing">QA Stage Guide</a><br />
          <a href="https://docs.google.com/document/d/1QkdaFK1tigrSI40iMeV3UP9GyTGsoqVmCUp7OJz0WFs">Community Advisor Guide</a><br />
          <a href="https://docs.google.com/document/d/1g-iZhDlKhUBZkui1uv8NVNfJC4oVD3JtR-P6Fue7XPU/edit">Proposal Assessment Guide</a><br />
        </p>
      </div>


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
