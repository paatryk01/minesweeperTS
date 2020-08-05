<template>
  <div>
    <h1>MineSweeper</h1>
    <h3>Marked fields: {{ flags }} 🚩 / {{ bombsAmount }} 💣</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from 'vuex-class'
const bombs = namespace('bombs')

@Component
export default class Header extends Vue {
  @bombs.State
  public bombsAmount!: number;
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