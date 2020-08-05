import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'bombs' })

class Bombs extends VuexModule { 
  public bombsAmount = 10;

  @Mutation
  public setBombs(newVal: number): void {
    this.bombsAmount = newVal;
  }

  @Action
  public updateBombs(newVal: number): void {
    this.context.commit('setBombs', newVal)
  }
}

export default Bombs