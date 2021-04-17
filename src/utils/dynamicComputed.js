function dynamicComputed (props, object) {
  return props.reduce((obj, prop) => {
    const propModel = prop.key
    const computedProp = {
      get() {
        return object ? this[object][propModel] : this[propModel]
      },
      set(value) {
        const assId = this[object].id
        this.$store.commit('assessments/setProp', {assId, propModel, value})
      }
    }
    obj[propModel] = computedProp
    return obj
  }, {})
}

export default dynamicComputed
