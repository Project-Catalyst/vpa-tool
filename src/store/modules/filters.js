export const useProfileStore = defineStore('filters', {
  persist: true,
  state: () => (
    { 
      surname: "Mattos", 
      name: 'Juliana',
      count: 0
    }
  ),
  getters: {
    completeName: (state) => state.name + ' ' + state.surname
  },
  actions: {
    increment() {
      this.count++
    },
  },
})