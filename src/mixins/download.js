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
      const assessmentsExport = this.assessments.map((item) => {
        let newItem = {
          ...originalAssessmentsIndexed[item.id],
          ...item,
        };
        if (!Object.prototype.hasOwnProperty.call(newItem, 'vpa_feedback')) {
          newItem['vpa_feedback'] = ''
        }
        return newItem
      });
      downloadCsv(assessmentsExport, this.profile.info.name)
      this.$buefy.dialog.alert({
        title: 'CSV Downloading...',
        message: '<div class="content">Your CSV is now downloading.<br />To complete the vPA submission you have to:<ol><li>Fill <u><a href="https://forms.gle/TxbXUQDzNEwP3DFM7" target="_blank">this form</a></u> with your details</li><li>Upload in the form the CSV you just downloaded.</div>',
        confirmText: 'OK'
      })
    }
  },
}

export default download
