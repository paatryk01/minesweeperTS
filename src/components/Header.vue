<template>
  <div>
    <h1>MineSweeper</h1>
    <h3>Marked fields: {{ flags }} 🚩 / {{ bombsAmount }} 💣</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class Header extends Vue {
  @Prop() readonly flags: number;
  @Prop({ default: 10 }) readonly bombsAmount: number;
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