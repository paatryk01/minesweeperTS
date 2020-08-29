<template>
  <div id="app">
    <Header />
    <Timer />
    <Board />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "./components/Header.vue";
import Board from "./components/Board.vue";
import Timer from "./components/Timer.vue";

@Component({
  components: {
    Header,
    Board,
    Timer
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "/src/styles/global.scss";
</style>
