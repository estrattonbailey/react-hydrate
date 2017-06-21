export default hydrate => {
  let state = {}

  const methods = {
    setState (obj) { 
      state = { ...state, ...obj }
    },
    getState () { 
      return state
    },
    clearState () { 
      state = {}
    },
    addLoader (conf) { 
      const key = Object.keys(conf)[0]
      const loader = conf[key].loader
      const props = conf[key].props

      state[key] = Promise.resolve(loader(props))

      return state[key]
    },
    fetch () {
      return Promise.all(
        Object.keys(state).map(key => state[key])
      ).catch(err => console.error(err))
    }
  }

  methods.setState(hydrate)

  return methods
}
