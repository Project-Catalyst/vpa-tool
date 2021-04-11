<template>
  <div class="conditions">
    <div class="filters">
      <div class="button">Choose Filters</div>
    </div>
    <div class="prefilters">
      <div class="prefilter-el"
        v-for="(el, i) in prefilters"
        @click="setList(el)"
        :class="{'selected': (el === currentPrefilter)}"
        :key="i">
        {{el.label}}
      </div>
    </div>
    <div class="button" @click="getNext">
      Next
    </div>
    <div class="button" @click="showList = ! showList">Show list</div>
    <div class="assessments-list" v-if="showList">
      <assessment-preview
        v-for="assessment in renderedList"
        :key="`ass-${assessment.id}`"
        :assessment="assessment" />
      <div class="button" @click="currentSlice = currentSlice + 100">Load more...</div>
    </div>
    <router-view class="sub-view" />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import shuffle from '@/utils/shuffle'
import AssessmentPreview from '@/components/AssessmentPreview'

export default {
  name: 'Conditions',
  components: {
    AssessmentPreview
  },
  data() {
    return {
      prefilters: [
        {label: 'Random', v: 'randomAssessments'},
        {label: 'Low reviewed', v: 'lowReviewed'},
        {label: 'No reviews', v: 'noReviewed'},
        {label: 'All', v: 'assessments'}
      ],
      currentPrefilter: false,
      currentList: [],
      currentIndex: 0,
      currentSlice: 100,
      showList: false
    }
  },
  computed: {
    ...mapState({
      assessments: state => state.assessments.all
    }),
    randomAssessments() {
      return shuffle(this.assessments)
    },
    lowReviewed() {
      return this.assessments.filter((el) => el.no_assessments <= 4)
        .sort((a,b) => a.no_assessments - b.assessments)
    },
    noReviewed() {
      return this.assessments.filter((el) => el.no_assessments === 0)
    },
    renderedList() {
      return this.currentList.slice(0, this.currentSlice)
    }
  },
  methods: {
    setList(el) {
      this.currentSlice = 100
      this.currentIndex = 0
      this.currentPrefilter = el
      this.currentList = this[el.v]
    },
    getNext() {
      this.$router.push({name: 'assessment', params: {id: this.currentList[this.currentIndex].id}})
      this.currentIndex = this.currentIndex + 1
    }
  }
}
</script>
<style lang="scss" scoped>
.conditions {
  display: flex;
  flex-direction: column;
  .prefilters {
    .prefilter-el {
      display: flex;
      cursor: pointer;
      &:before {
        content: ' ';
        width: 15px;
        height: 15px;
        border: 1px solid #000;
        margin-right: 10px;
      }
      &.selected {
        &:before {
          background: #000;
        }
      }
    }
  }
  .assessments-list {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
