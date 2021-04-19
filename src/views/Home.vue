<template>
  <div class="section">
    <div class="buttons">
      <b-button
        type="is-primary"
        tag="router-link"
        :to="{ name: 'profile' }"
        expanded
      >
        Start Process</b-button
      >
    </div>
    <b-message>
      This is an app to help vCAs with the review process. It's currently in
      Early development. Please report any bugs.
    </b-message>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
