<template>
  <div>
    <form class="options" @submit.prevent="prepareNewGame">
      <p>Size</p>
      <input
        type="number"
        class="input-number"
        :min="fieldSizeMin"
        :max="fieldSizeMax"
        v-model.number="width"
      />
      <p>Bombs Amount</p>
      <input
        type="number"
        class="input-number"
        :min="bombsMin"
        :max="bombsMax"
        v-model.number="bombsAmount"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { States } from "../Enums";

@Component
export default class Board extends Vue {
  //data
  width = 10;
  fieldSizeMin = 5;
  fieldSizeMax = 20;
  bombsMin = 5;
  bombsMax = 40;
  bombsAmount = 10; 
  flags = 0;
  isGameOver = false;
  squares: Array<string> = [];
  cells: Array<any> = []; //tablica z HTMLDivElement
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
  ]; //sprawdzić czy nie zrobić z tego enuma
  gameState: string = States.Start;
  topEdge:number = this.width - 1;
  topLeftCorner:number = this.width;
  lastCell:number = this.width * this.width - 1;
  downEdge:number = this.width * this.width - this.width;
  downRightCorner:number = this.width * this.width - this.width - 1;

  //watchers

  @Watch("width")
  onWidthChange(width: number) {
    this.topEdge = width - 1;
    this.topLeftCorner = width;
    this.lastCell = width * width - 1;
    this.downEdge = width * width - width;
    this.downRightCorner = width * width - width - 1;
  }

  //methods
  async prepareNewGame() {
    const grid = document.querySelector<HTMLElement>(".grid");
    if (this.bombsAmount < this.width * this.width) {
      this.$emit("bombsAmount", this.bombsAmount);
    } else {
      alert(`You can't set more bombs than fields.`);
      this.bombsAmount = 10;
    }

    if (grid != null) {
      grid.style.width = this.width * 40 + "px";
      await this.clearHelper();
      await this.createBoard();
      await this.fillCells();
    }
    return;
  }

  private createBoard(): void {
    const bombsArray = Array(this.bombsAmount).fill("bomb");
    const emptyArray = Array(this.width * this.width - this.bombsAmount).fill(
      "empty"
    );
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    this.squares = [...shuffledArray];
  }

  private fillCells(): void {
    const elements = document.getElementsByClassName("square");
    for (let i = 0; i < elements.length; i++) {
      this.cells.push(elements[i]);
    }

    // this.cells = [...elements];
    this.addNumbers();
  }

  public clicked(square: any) {
    if (square === undefined) {
      square = event!.target;
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

  private addFlag() {
    const square = event!.target as HTMLTextAreaElement;

    if (this.isGameOver) return;
    if (
      !square.classList.contains("checked") &&
      this.flags <= this.bombsAmount
    ) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        this.flags++;
        this.checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        this.flags--;
      }
    }
    this.$emit("flags", this.flags);
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

  public checkSquare(currentId: any) {
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
    if (matches === this.bombsAmount) {
      this.isGameOver = true;
      this.gameState = States.Won;
      alert("Congratulations, you are a winner! 🏆");
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
    this.flags = 0;
    this.isGameOver = false;
    this.$emit("flags", this.flags);
  }

  created() {
    this.createBoard();
  }
  mounted() {
    this.fillCells();
  }
}
</script>

<style scoped>
.grid {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  background-color: rgb(235, 230, 223);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 240px;
  margin: 30px 0px 150px;
}
.square {
  height: 40px;
  width: 40px;
  box-sizing: border-box;
  border: 2px solid;
  border-color: #eee #999 #999 #eee;
  background-color: #ccc;
  font-weight: 500;
}
.square:hover {
  background-color: #ddd;
}
.gameState {
  text-align: center;
}
.bomb {
  /* background-color: red; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.checked {
  color: #0000ff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #bbb;
  border-width: 1px;
  border-color: #999;
  padding: 1px;
}
.flag {
  display: flex;
  justify-content: center;
  align-items: center;
}
.startButton {
  font-family: "Righteous";
  text-transform: uppercase;
  background-color: transparent;
  color: #000;
  border: 2px solid #000;
  padding: 6px 12px;
}
.startButton:hover {
  cursor: pointer;
  transition: 1s;
  background-color: #000;
  color: #fff;
  border-radius: 0px 8px 0px 8px;
}
.one {
  color: #0000ff;
}
.two {
  color: #008500;
}
.three {
  color: #ff0000;
}
.four {
  color: #060073;
}
.five,
.six,
.seven,
.eight {
  color: #070077;
}
.options {
  display: flex;
  justify-content: center;
  font-weight: 600;
}
.options input {
  margin: 0 15px;
  background: transparent;
  border: 0px;
  border-bottom: 2px solid #000;
  font-family: "Righteous";
  font-size: 16px;
  text-align: center;
}
</style>
