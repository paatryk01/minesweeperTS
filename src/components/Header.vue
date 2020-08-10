<template>
  <div>
    <h1>MineSweeper</h1>
    <h3>Marked fields: {{ flags }} 🚩 / {{ bombsAmount }} 💣</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  get bombsAmount(): number {
    const { bombsAmount } = this.$store.state;
    return bombsAmount;
  }

  get flags(): number {
    const { flags } = this.$store.state;
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
