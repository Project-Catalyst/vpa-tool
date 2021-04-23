<template>
  <div id="app">
    <b-navbar class="is-primary" :mobile-burger="false">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown label="User">
          <b-navbar-item tag="router-link" :to="{ name: 'profile' }">
            Profile
          </b-navbar-item>
        </b-navbar-dropdown>
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
