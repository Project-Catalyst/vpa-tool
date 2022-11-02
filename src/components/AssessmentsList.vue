<script setup>
import { ref } from 'vue'
import AssessmentPreview from "./AssessmentPreview.vue";

const count = ref("ASSESSMENTS LIST")
const localTot = ref("localTot")
const fullCount = ref("fullCount")
const filteredCount = ref("filteredCount")
const showListLabel = ref("showListLabel")
const listVisible = ref(true)

function getNext() {
  console.log("getNext")
}

function toggleList() {
  console.log("toggleList")
}

function exportCsv() {
  console.log("exportCsv")
}

</script>

<template>
  <section>

    <!-- header -->
    <o-notification class="" variant="primary">
      <span class="m-2" >Your progress: {{localTot}}/{{fullCount}}</span>
      <span class="m-2">Filtered results: {{filteredCount}}</span>
      <div class="buttons is-flex mt-3">
        <o-button variant="primary" inverted @click="getNext()">Next</o-button>
        <o-button
          variant="primary"
          inverted
          outlined
          @click="toggleList()"
          >{{ showListLabel }}</o-button
        >
        <div class="is-flex-grow-1">
          <!-- <o-button class="is-pulled-right" @click="exportCsv" v-if="profile.localDb"> ACTIVATE THIS ONE AFTER STORE SETUP-->
          <o-button class="is-pulled-right" @click="exportCsv()">
            Export CSV
          </o-button>
        </div>
      </div>
    </o-notification>

    <!-- Assessment's preview list -->
    <div class="assessments-list" v-if="listVisible">
      <assessment-preview
        v-for="assessment in [0,1,2,3,4,5]"
        :key="`ass-${assessment}`"
      />
      <!-- <assessment-preview
        v-for="assessment in renderedList"
        :key="`ass-${assessment.id}`"
        :assessment="assessment"
      /> -->
    </div>

  </section>
</template>

<style lang="scss" scoped>
.assessment-preview {
  width: 100%;
  &:nth-child(2n + 1) {
    background: #f5f5f5;
  }
  .info {
    display: flex;
    padding: 5px 5px 0 5px !important;
    box-sizing: border-box !important;
    .label {
      font-weight: bold;
      margin-bottom: 0 !important;
    }
    &.text {
      flex-wrap: wrap;
      .value {
        width: 100%;
        font-size: 13px;
      }
    }
  }
  .always-opaque {
    opacity: 1 !important;
  }
}
</style>