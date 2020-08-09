<template>
  <div class="timer-group">
    <h3>Time:</h3>
    <div id="timer">{{ this.timeElapsed.toFixed(1) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";

@Component
export default class Timer extends Vue {
  timer: number;

  get timeElapsed(): number {
    const timeElapsed = this.$store.state.timeElapsed;
    return timeElapsed;
  }
}
</script>

<style scoped>
.timer-group {
  display: flex;
  justify-content: center;
  font-size: 16px;
}

.timer-group h3 {
  margin: 0 15px;
}
</style>
