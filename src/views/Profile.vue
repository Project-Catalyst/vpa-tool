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
      <b-field label="Name">
        <b-input v-model="name"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input type="email" v-model="email"></b-input>
      </b-field>

      <section v-if="initialized && !localDb">
        <b-field>
          <b-upload v-model="file" drag-drop expanded @change="readFile">
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>Drop your file here or click to upload</p>
              </div>
            </section>
          </b-upload>
        </b-field>

        <div class="tags">
          <span v-if="file" class="tag is-primary">
            {{ file.name }}
            <button
              class="delete is-small"
              type="button"
              @click="deleteDropFile(index)"
            ></button>
          </span>
        </div>
      </section>

      <div class="database" v-if="initialized && !localDb">
        <input type="file" @change="readFile" />
        <div class="recap" v-if="csv">
          No of assessments to be loaded: {{ csv.data.length }}
          <div class="button" v-if="csv.data.length > 0" @click="importCsv">
            Import local Database
          </div>
        </div>
      </div>
      <div class="database-loaded" v-if="initialized && localDb">
        Database loaded. No of assessments: {{ assessments.length }}
        <div class="button" @click="clear">Clear Database (!!!)</div>
        <router-link class="button" :to="{ name: 'conditions' }"
          >Start Reviewing</router-link
        >
      </div>
    </section>
  </article>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      csv: false,
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
