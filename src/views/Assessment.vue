<template>
  <div class="assessment">
    <div class="wrapper">
      <router-link class="close" :to="{ name: 'conditions' }">
        <span>&nbsp;</span>
        <span>&nbsp;</span>
      </router-link>
      <h1>Assessment Details</h1>
      <div class="info">
        <div class="single-info">
          <div class="label">Proposal</div>
          <div class="value">
            <a :href="proposal.url" target="_blank">{{proposal.title}}</a>
          </div>
        </div>
        <div class="single-info">
          <div class="label">Challenge</div>
          <div class="value">{{category.title}}</div>
        </div>
        <div class="single-info">
          <div class="label">Question</div>
          <div class="value">{{question.title}}</div>
        </div>
        <div class="single-info half first">
          <div class="label">Rating</div>
          <div class="value">{{assessment.rating}}</div>
        </div>
        <div class="single-info half last">
          <div class="label">Flagged by Proposer</div>
          <div class="value">{{assessment.proposer_flag}}</div>
        </div>
        <div class="single-info full">
          <div class="label">Assessment Note:</div>
          <div class="value">{{assessment.note}}</div>
        </div>
      </div>
      <div class="review">
        <div class="el" :class="[criterium.color]" v-for="(criterium, idx) in criteria" :key="idx">
          <label :for="`label-${criterium.key}`">{{criterium.name}}</label>
          <input :id="`label-${criterium.key}`" v-if="!criterium.type" type="checkbox" v-model="self()[criterium.key]" />
          <div class="additional-info" v-tooltip="criterium.info">i</div>
          <textarea v-model="self()[criterium.key]" v-if="criterium.type"></textarea>
        </div>
      </div>
      <div class="button" @click="getNext">
        Next
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import proposals from '../assets/data/proposals.json'
import categories from '../assets/data/categories.json'
import questions from '../assets/data/questions.json'
import criteria from '../assets/data/criteria.json'
import dynamicComputed from '@/utils/dynamicComputed'

import { EventBus } from './../EventBus';

export default {
  name: 'Assessment',
  data() {
    return {
      proposals: proposals,
      categories: categories,
      questions: questions,
      criteria: criteria

    }
  },
  computed: {
    ...mapGetters('assessments', ['getById']),
    ...dynamicComputed(criteria, 'assessment'),
    assessment() {
      return this.getById(this.$route.params.id);
    },
    proposal() {
      if (this.assessment) {
        let filtered = this.proposals.filter(p => (p.id === parseInt(this.assessment.proposal_id)))
        if (filtered.length) {
          return filtered[0]
        }
      }
      return false
    },
    category() {
      if (this.proposal) {
        let filtered = this.categories.filter(c => (c.id === parseInt(this.proposal.category)))
        if (filtered.length) {
          return filtered[0]
        }
      }
      return false
    },
    question() {
      if (this.proposal) {
        let filtered = this.questions.filter(q => (q.id === parseInt(this.assessment.question_id)))
        if (filtered.length) {
          return filtered[0]
        }
      }
      return false
    }
  },
  methods: {
    self() {
      return this
    },
    getNext() {
      EventBus.$emit('next-assessment')
    }
  },
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
  overflow: auto;
  .wrapper {
    max-width: 600px;
    width: 100%;
    margin: 0px auto;
    position: relative;
    h1 {
      text-align: center;
    }
    .close {
      position: absolute;
      top: 0px;
      right: 0;
      display: block;
      width: 25px;
      height: 25px;
      span {
        display: block;
        width: 30px;
        height: 4px;
        background: #000;
        position: absolute;
        top: 50%;
        left: 50%;
        cursor: pointer;
        &:nth-child(1) {
          transform: translateX(-50%) translateY(-50%) rotate(45deg);
        }
        &:nth-child(2) {
          transform: translateX(-50%) translateY(-50%) rotate(-45deg);
        }
      }
    }
    .info {
      width: 100%;
      .single-info {
        width: 100%;
        float: left;
        border: 2px solid #000;
        padding: 10px;
        margin-bottom: 20px;
        .label {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        &.half {
          width: calc(50% - 10px);
          &.first {
            margin-right: 10px;
          }
          &.last {
            margin-left: 10px;
          }
        }
      }
    }
    .review {
      width: 100%;
      .el {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        &.yellow {
          background: #ffef93;
        }
        &.red {
          background: #ff9393;
        }
        &.green {
          background: #baffb2;
        }
        label {
          flex-grow: 1;
          cursor: pointer;
        }
        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          height: 100px;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          padding: 5px;
          font-size: 14px;
        }
        .additional-info {
          background: #000;
          color: #fff;
          font-size: 10px;
          width: 10px;
          height: 10px;
          text-align:center;

        }
      }
    }
  }
}
</style>
