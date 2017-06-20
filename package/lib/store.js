let state = {}

export default {
  setState: obj => state = { ...state, ...obj },
  getState: () => state,
  addLoader: conf => {
    const key = Object.keys(conf)[0]
    const loader = conf[key].loader
    const props = conf[key].props

    state[key] = Promise.resolve(loader(props))

    return state[key]
  },
  fetch () {
    return new Promise((resolve, reject) => {
      Promise.all(
        Object.keys(state).map(key => state[key])
      ).then(resolve).catch(reject)
    })
  }
}
