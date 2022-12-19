<template>
  <div v-if="days>0" class="pt-4 pl-3">
    <p><b>Time until end of vPA process: </b>
    {{days}} days {{ hours % 24 }}h{{ minutes % 60 }}m{{ seconds % 60 }}s</p>
  </div>
  <div v-if="days===0" class="pt-4 pl-3">
    <p><b>Time until end of vPA process: </b> {{days}} days </p>
  </div>
  <div v-if="days<0" class="pt-4 pl-3">
    <p><b>Time until end of vPA process: </b> closed process </p>
  </div>
</template>


<script>
import { ref } from '@vue/reactivity';
export default {
  name: "Timer",
  setup() {
    const days = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    const lunchDate = new Date(import.meta.env.VITE_DUE_DATE);
    setInterval(() => {
      const currentDate = new Date();
      const lunchTime = lunchDate - currentDate;
      seconds.value = parseInt(lunchTime / 1000);
      minutes.value = parseInt(seconds.value / 60);
      hours.value = parseInt(minutes.value / 60);
      days.value = parseInt(hours.value / 24);
    }, 1000);
    return { days, hours, minutes, seconds }
  },
};
</script>



<style>
</style>