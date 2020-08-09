<template>
  <div class="timer-group">
    <p>Time:</p>
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
}
.timer-group p {
  margin: 0 15px;
  font-size: 16px;
  font-weight: 600;
}
</style>
