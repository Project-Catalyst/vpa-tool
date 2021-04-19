<template>
  <div id="app">
    <b-navbar class="is-primary" :mobile-burger="false">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'home' }">
          <img
            src="@/assets/images/catalyst.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view class="main-view" />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <router-link :to="{ name: 'stats' }">Statistics</router-link>
        </p>
      </div>
    </footer>
  </div>
</template>
