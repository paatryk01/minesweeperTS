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
  $store: any;

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
<style lang="scss">
@import "/src/styles/header.scss";
</style>
