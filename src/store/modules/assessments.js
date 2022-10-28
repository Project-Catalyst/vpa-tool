export const useProfileStore = defineStore('assessments', {
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