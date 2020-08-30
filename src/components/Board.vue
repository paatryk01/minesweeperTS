<template>
  <div>
    <form class="options" @submit.prevent="prepareNewGame">
      <p>Size:</p>
      <input
        type="number"
        class="input-number"
        :min="fieldSizeMin"
        :max="fieldSizeMax"
        v-model.number="width"
      />
      <p>Bombs Amount:</p>
      <input
        type="number"
        class="input-number"
        :min="bombsMin"
        :max="bombsMax"
        :placeholder="10"
        @input="updateBombs"
      />
      <button class="startButton">New game</button>
    </form>
    <h2 class="gameState" v-text="this.gameState" />
    <div class="grid">
      <div
        class="square"
        v-for="(square, index) in squares"
        :id="index"
        :key="index"
        :class="squares[index]"
        @click="clicked()"
        @click.right.prevent="addFlag"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from "vue-property-decorator";
import States from "../Enums";
import TimerMixin from "../Mixins";
import store from "../store";

@Component
export default class Board extends Mixins(TimerMixin) {
  // data
  width: number = 10;

  fieldSizeMin: number = 5;

  fieldSizeMax: number = 20;

  bombsMin: number = 5;

  bombsMax: number = 40;

  isGameOver: boolean = false;

  timerEnabled: boolean = true;

  squares: Array<string> = [];

  cells: Array<any> = [];

  gameState: string = States.Start;

  topEdge: number = this.width - 1;

  topLeftCorner: number = this.width;

  lastCell: number = this.width * this.width - 1;

  downEdge: number = this.width * this.width - this.width;

  downRightCorner: number = this.width * this.width - this.width - 1;

  classesToDelete: Array<string> = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "bomb",
    "flag",
    "checked"
  ];

  $store: any;

  // store
  public updateBombs(e): void {
    this.$store.commit("updateBombs", parseInt(e.target.value));
  }

  get flags(): number {
    const { flags } = this.$store.state;
    return flags;
  }

  updateFlags(): void {
    this.$store.dispatch("updateFlags", this.flags);
  }

  // watchers
  @Watch("width")
  onWidthChange(width: number) {
    this.topEdge = width - 1;
    this.topLeftCorner = width;
    this.lastCell = width * width - 1;
    this.downEdge = width * width - width;
    this.downRightCorner = width * width - width - 1;
  }

  // methods
  private async prepareNewGame() {
    const grid = document.querySelector<HTMLElement>(".grid");
    if (this.$store.state.bombsAmount < this.width * this.width) {
      this.$store.dispatch("updateBombs", this.$store.state.bombsAmount);
    } else {
      alert(`You can't set more bombs than fields.`);
      this.$store.dispatch("updateBombs", 10);
    }
    if (grid != null) {
      grid.style.width = `${this.width * 40}px`;
      await this.clearHelper();
      await this.createBoard();
      await this.fillCells();
      this.stopTimer();
      this.resetTimer();
      this.timerEnabled = true;
    }
  }

  private createBoard(): void {
    const bombsArray = Array(this.$store.state.bombsAmount).fill("bomb");
    const emptyArray = Array(
      this.width * this.width - this.$store.state.bombsAmount
    ).fill("empty");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    this.squares = [...shuffledArray];
  }

  private fillCells(): void {
    const elements = document.getElementsByClassName("square");
    for (let i = 0; i < elements.length; i++) {
      this.cells.push(elements[i]);
    }
    this.addNumbers();
    console.log(this.cells);
  }

  public clicked(square) {
    if (this.timerEnabled === true) {
      this.resetTimer();
      this.startTimer();
      this.timerEnabled = false;
    }
    if (square === undefined) {
      square = window.event!.target;
    }
    const currentId = square.id;
    if (this.isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) this.gameOver();
    const total = square.getAttribute("data");
    if (total > 0 && total <= this.classesToDelete.length) {
      square.classList.add("checked");
      square.classList.add(this.classesToDelete[total - 1]);
      square.innerHTML = total;
      if (total > 3) {
        this.gameState = States.SoClose;
      }
      return;
    }
    if (!square.classList.contains("bomb")) {
      this.gameState = States.NiceTry;
    }
    this.checkSquare(currentId);
    square.classList.add("checked");
  }

  private addFlag(): void {
    const square = window.event!.target as HTMLTextAreaElement;
    if (this.isGameOver) return;
    if (
      !square.classList.contains("checked") &&
      this.$store.state.flags <= this.$store.state.bombsAmount
    ) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        this.$store.dispatch("updateFlags", this.flags + 1);
        this.checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        this.$store.dispatch("updateFlags", this.flags - 1);
      }
    }
  }

  private addNumbers(): void {
    for (let i = 0; i < this.cells.length; i++) {
      let total = 0;
      const isLeftEdge = i % this.width === 0;
      const isRightEdge = i % this.width === this.width - 1;
      if (this.cells[i].classList.contains("empty")) {
        if (
          i > 0 &&
          !isLeftEdge &&
          this.cells[i - 1].classList.contains("bomb")
        )
          total++;
        if (
          i > this.topEdge &&
          !isRightEdge &&
          this.cells[i + 1 - this.width].classList.contains("bomb")
        )
          total++;
        if (
          i > this.topEdge &&
          this.cells[i - this.width].classList.contains("bomb")
        )
          total++;
        if (
          i > this.topLeftCorner &&
          !isLeftEdge &&
          this.cells[i - 1 - this.width].classList.contains("bomb")
        )
          total++;
        if (
          i < this.lastCell &&
          !isRightEdge &&
          this.cells[i + 1].classList.contains("bomb")
        )
          total++;
        if (
          i < this.downEdge &&
          !isLeftEdge &&
          this.cells[i - 1 + this.width].classList.contains("bomb")
        )
          total++;
        if (
          i < this.downRightCorner &&
          !isRightEdge &&
          this.cells[i + 1 + this.width].classList.contains("bomb")
        )
          total++;
        if (
          i < this.downEdge &&
          this.cells[i + this.width].classList.contains("bomb")
        )
          total++;
        this.cells[i].setAttribute("data", total);
      }
    }
  }

  public checkSquare(currentId) {
    const isLeftEdge = currentId % this.width === 0;
    const isRightEdge = currentId % this.width === this.width - 1;
    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = this.cells[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId > this.topEdge && !isRightEdge) {
        const newId = this.cells[parseInt(currentId) + 1 - this.width].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId > this.topEdge) {
        const newId = this.cells[parseInt(currentId) - this.width].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId > this.topLeftCorner && !isLeftEdge) {
        const newId = this.cells[parseInt(currentId) - 1 - this.width].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId < this.lastCell && !isRightEdge) {
        const newId = this.cells[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId < this.downEdge && !isLeftEdge) {
        const newId = this.cells[parseInt(currentId) - 1 + this.width].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId < this.downRightCorner && !isRightEdge) {
        const newId = this.cells[parseInt(currentId) + 1 + this.width].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
      if (currentId < this.downEdge) {
        const newId = this.cells[parseInt(currentId) + this.width].id;
        const newSquare = document.getElementById(newId);
        this.clicked(newSquare);
      }
    }, 10);
  }

  public gameOver(): void {
    this.isGameOver = true;
    this.gameState = States.Lost;
    this.cells.forEach(square => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.style = "background-color: #ff0000";
      }
    });
    this.stopTimer();
  }

  public checkForWin(): void {
    let matches = 0;
    for (let i = 0; i < this.cells.length; i++) {
      if (
        this.cells[i].classList.contains("flag") &&
        this.cells[i].classList.contains("bomb")
      ) {
        matches++;
      }
    }
    if (matches === this.$store.state.bombsAmount) {
      this.isGameOver = true;
      this.gameState = States.Won;
      this.stopTimer();
      alert(`Congratulations, you are a winner! 🏆 
      You did it in ${this.$store.state.timeElapsed.toFixed(1)} seconds`);
    }
  }

  public clearHelper(): void {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].classList.remove(...this.classesToDelete);
      this.cells[i].innerText = "";
      this.cells[i].removeAttribute("style");
      this.cells[i].removeAttribute("data");
    }
    this.gameState = States.Start;
    this.squares = [];
    this.cells = [];
    this.isGameOver = false;
    this.$store.dispatch("updateFlags", 0);
  }

  // life cycle
  created() {
    this.createBoard();
  }

  mounted() {
    this.fillCells();
  }
}
</script>

<style lang="scss">
@import "/src/styles/board.scss";
</style>
