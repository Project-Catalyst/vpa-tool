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
    }
  },
}

export default download
