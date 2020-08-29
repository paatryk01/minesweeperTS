<template>
  <div class="timer-group">
    <p>Time:</p>
    <div id="timer">{{ this.timeElapsed.toFixed(1) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Timer extends Vue {
  timer: number;

  $store: any;

  get timeElapsed(): number {
    const { timeElapsed } = this.$store.state;
    return timeElapsed;
  }
}
</script>

<style lang="scss">
@import "/src/styles/timer.scss";
</style>
