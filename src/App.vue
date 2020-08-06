<template>
  <div id="app">
    <Header />
    <Board />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "./components/Header.vue";
import Board from "./components/Board.vue";

@Component({
  components: {
    Header,
    Board
  }
})
export default class App extends Vue {}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Righteous&display=swap");
body {
  background: linear-gradient(160deg, #a6e0d9, #3dac9f);
  background-repeat: no-repeat;
  background-size: contain;
  height: 1200px;
  font-family: "Righteous", cursive;
  text-transform: uppercase;
}
</style>
