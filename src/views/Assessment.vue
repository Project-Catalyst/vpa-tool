<template>
  <div class="assessment">
    <div class="card">
      <!-- <div class="card-image">
        <figure class="image is-4by3">
          <img
            src="https://via.placeholder.com/1280x960"
            :alt="proposal.title"
          />
        </figure>
      </div> -->
      <div class="card-content">
        <p class="title is-4">{{ proposal.title }}</p>
        <p class="subtitle is-6">{{ category.title }}</p>

        <div class="columns is-multiline is-mobile">
          <div class="column is-full">
            <p class="title is-6">Question</p>
            <p class="subtitle is-6">{{ question.title }}</p>
          </div>
          <div class="column is-half">
            <p class="title is-6">Rating</p>
            <p class="subtitle is-6">{{ assessment.rating }}</p>
          </div>
          <div class="column is-half">
            <p class="title is-6">Flagged by Proposer</p>
            <p class="subtitle is-6">{{ assessment.proposer_flag }}</p>
          </div>
          <div class="column is-full">
            <p class="title is-6">Assessment Note</p>
            <p class="subtitle is-6">{{ assessment.note }}</p>
          </div>
          <div class="column is-full">
            <p class="title is-6">Reviews</p>
            <p class="subtitle is-6">{{ assessment.reviews }}</p>
          </div>
          <div
            class="column is-full"
            v-for="(c, i) in criteria"
            :key="i"
            :class="[c.color]"
          >
            <b-field :label="c.type ? c.name : ''">
              <b-checkbox v-if="!c.type" v-model="self()[c.key]">{{
                c.name
              }}</b-checkbox>
              <b-input
                maxlength="200"
                type="textarea"
                v-model="self()[c.key]"
                v-if="c.type"
              ></b-input>
            </b-field>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <router-link class="card-footer-item" to="/conditions">
          Overview
        </router-link>

        <a @click="getNext" class="card-footer-item">
          Next
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categories.json";
import questions from "../assets/data/questions.json";
import criteria from "../assets/data/criteria.json";
import dynamicComputed from "@/utils/dynamicComputed";

import { EventBus } from "./../EventBus";

export default {
  name: "Assessment",
  data() {
    return {
      proposals: proposals,
      categories: categories,
      questions: questions,
      criteria: criteria,
    };
  },
  asyncComputed: {
    // ideaImageSrc: {
    //   // The `get` function is the same as the function you would
    //   // pass directly as the value to `blogPostContent` if you
    //   // didn't need to specify a default value.
    //   get() {
    //     return this.axios.get(this.proposal.url).then((response) => {
    //       console.log(response);
    //       return "https://via.placeholder.com/1280x960";
    //     });
    //   },
    //   // The computed proporty `blogPostContent` will have
    //   // the value 'Loading...' until the first time the promise
    //   // returned from the `get` function resolves.
    //   default: "https://via.placeholder.com/1280x960",
    // },
  },
  computed: {
    ...mapGetters("assessments", ["getById"]),
    ...dynamicComputed(criteria, "assessment"),
    assessment() {
      return this.getById(this.$route.params.id);
    },
    proposal() {
      if (this.assessment) {
        let filtered = this.proposals.filter(
          (p) => p.id === parseInt(this.assessment.proposal_id)
        );
        if (filtered.length) {
          return filtered[0];
        }
      }
      return false;
    },
    category() {
      if (this.proposal) {
        let filtered = this.categories.filter(
          (c) => c.id === parseInt(this.proposal.category)
        );
        if (filtered.length) {
          return filtered[0];
        }
      }
      return false;
    },
    question() {
      if (this.proposal) {
        let filtered = this.questions.filter(
          (q) => q.id === parseInt(this.assessment.question_id)
        );
        if (filtered.length) {
          return filtered[0];
        }
      }
      return false;
    },
  },
  methods: {
    self() {
      return this;
    },
    getNext() {
      EventBus.$emit("next-assessment");
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.column {
  &.yellow {
    background: #ffef93;
  }
  &.red {
    background: #ff9393;
  }
  &.green {
    background: #baffb2;
  }
}
</style>
