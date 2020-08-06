<template>
  <div>
    <h1>MineSweeper</h1>
    <h3>Marked fields: {{ flags }} 🚩 / {{ bombsAmount }} 💣</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from "../store";
@Component
export default class Header extends Vue {
  // @Prop({ default: 10 }) readonly bombsAmount: number;

  get bombsAmount(): number {
    const bombsAmount = this.$store.state.bombsAmount;
    return bombsAmount;
  }

  get flags(): number {
    const flags = this.$store.state.flags;
    return flags;
  }
}
</script>

<style scoped>
h1 {
  font-size: 40px;
}
h1,
h3 {
  text-align: center;
}
</style>
