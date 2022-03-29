import { mapState } from "vuex";
import downloadCsv from "@/utils/export-csv";
import originalAssessments from "@/assets/data/assessments.csv";

const download = {
  data() {
    return {
      originalAssessments: originalAssessments
    }
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile,
      assessments: (state) => state.assessments.all,
    })
  },
  methods: {
    exportCsv() {
      let originalAssessmentsIndexed = {}
      this.originalAssessments.forEach(el => {
        originalAssessmentsIndexed[el.id] = el
      })
      const assessmentsExport = this.assessments.map(item => ({
        ...originalAssessmentsIndexed[item.id],
        ...item,
      }));
      downloadCsv(assessmentsExport, this.profile.info.name)
      this.$buefy.dialog.alert({
        title: 'CSV Downloading...',
        message: '<div class="content">Your CSV is now downloading.<br />To complete the vCA submission you have to:<ol><li>Create a new Google Sheet document</li><li>Click <i>File</i> -> <i>Import</i> and select the CSV downloaded</li><li>Change the share settings to <i>Anyone with the link can view</i>.<br /><b>Important!</b> If you don\'t change the share settings, your reviews will not be used</li><li>Fill <u><a href="https://docs.google.com/forms/d/1-9mPZ26p1mqUa3ITxwbmpJQ4ioYo6n6LsWmI9W_Ruro/viewform">this form</a></u> with your details and the link to the Google Sheet document.</div>',
        confirmText: 'OK'
      })
    }
  },
}

export default download
