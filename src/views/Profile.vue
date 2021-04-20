<template>
  <article id="profile" class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title">
          vCA Review Tool
        </p>
        <p class="subtitle">
          Load a file to get started
        </p>
      </div>
    </section>
    <section class="section">
      <b-field label="Full Name">
        <b-input v-model="name"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input type="email" v-model="email"></b-input>
      </b-field>

      <b-field class="file is-primary" :class="{ 'has-name': !!csv }">
        <b-upload v-on:input="readFile" drag-drop expanded accept=".csv">
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large" v-if="!csv"></b-icon>
                <b-icon icon="check" size="is-large" v-if="csv"></b-icon>
              </p>
              <p>Drop your file here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </b-field>

      <b-message v-if="csv" type="is-success">
        No of assessments to be loaded: {{ csv.data.length }}
      </b-message>

      <b-message v-if="!csv" type="is-information">
        Upload CSV to load assessments.
      </b-message>

      <b-button type="is-primary" :disabled="!csv">Import Data</b-button>
    </section>
  </article>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      csv: null,
    };
  },
  computed: {
    ...mapState({
      initialized: (state) => state.profile.initialized,
      localDb: (state) => state.profile.localDb,
      assessments: (state) => state.assessments.all,
    }),
    name: {
      get() {
        return this.$store.state.profile.info.name;
      },
      set(value) {
        this.$store.commit("profile/setName", value);
      },
    },
    email: {
      get() {
        return this.$store.state.profile.info.email;
      },
      set(value) {
        this.$store.commit("profile/setEmail", value);
      },
    },
  },
  methods: {
    importCsv() {
      if (this.csv) {
        if (this.csv.data) {
          this.$store.commit("profile/setLocalDb", true);
          this.$store.commit("assessments/setAssessments", this.csv.data);
        }
      }
    },
    onComplete(results) {
      this.csv = results;
    },
    readFile() {
      let file = event.target.files[0];
      this.$papa.parse(file, {
        header: true,
        complete: this.onComplete,
      });
    },
    clear() {
      this.$store.commit("profile/resetState");
      this.$store.commit("assessments/resetState");
    },
  },
};
</script>
