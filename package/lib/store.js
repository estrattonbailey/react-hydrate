let hash = {}
let state = {}

const store = {
  getHash () {
    return hash
  },
  setHash (obj) {
    Object.keys(obj).forEach(key => hash[key] = true)
  },
  setState (obj) {
    state = { ...state, ...obj }
  },
  getState () {
    return Promise.all(
      Object.keys(state).map(key => state[key])
    ).then(data => {
      return data.reduce((res, dat, i) => {
        res[Object.keys(state)[i]] = dat
        return res
      }, {})
    }).catch(err => console.error(err))
  },
  clearState () {
    state = {}
    hash = {}
  },
  addLoader (conf) {
    const key = Object.keys(conf)[0]
    const loader = conf[key].loader
    const props = conf[key].props

    state[key] = Promise.resolve(loader(props))

    hash[key] = true

    return state[key]
  }
}

export default store
