import { Component, Vue } from "vue-property-decorator";

@Component
class TimerMixin extends Vue {
  timer: number;

  get timeElapsed(): number {
    const timeElapsed = this.$store.state.timeElapsed;
    return timeElapsed;
  }

  updateTime(): void {
    this.$store.dispatch("updateTime", this.timeElapsed);
  }

  public startTimer(): void {
    this.timer = setInterval(() => {
      this.$store.state.timeElapsed += 0.1;
    }, 100);
  }

  public stopTimer(): void {
    clearInterval(this.timer);
  }

  public resetTimer(): void {
    this.$store.state.timeElapsed = 0;
  }
}

export default TimerMixin;
