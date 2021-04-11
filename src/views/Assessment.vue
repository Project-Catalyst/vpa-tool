<template>
  <div class="assessment">
    <div class="wrapper">
      <router-link class="aaa" :to="{ name: 'conditions' }">Close</router-link>
      {{assessment.id}}
      {{assessment.note}}
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Assessment',
  computed: {
      ...mapGetters('assessments', ['getById']),
      assessment: function () {
        return this.getById(this.$route.params.id);
      }
    }
}
</script>

<style lang="scss" scoped>
.assessment {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  .wrapper {
    max-width: 600px;
    width: 100%;
    margin: 0px auto;
  }
}
</style>
