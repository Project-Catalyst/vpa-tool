import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  persist: true,
  state: () => (
    {
      initialized: false,
      info: {
        name: '',
        email: ''
      }
    }
  ),
  getters: {
    isInitialized () {
      return (this.info.name !== '') && (this.info.email !== '')
    }
  },
  actions: {
    init(name, email) {
      this.info.name = name
      this.info.email = email
      this.initialized = this.isInitialized
    },
    // setName (name) {
    //   this.info.name = name
    //   this.initialized = checkInitialized(state)
    // },
    // setEmail (email) {
    //   this.info.email = email
    //   this.initialized = checkInitialized(state)
    // },
    // setProposersRationale (value) {
    //   this.info.proposersRationaleVisible = value
    //   this.initialized = checkInitialized(state)
    // },
    resetState () {
      this.$reset()
    }
  },
})