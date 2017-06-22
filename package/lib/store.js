import merge from 'deepmerge'

export default hydrate => {
  let loaders = []
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
      loaders = []
    },
    addLoader (config, reload) {
      let resolve
      let [ loader, props ] = config

      const exists = loaders.filter(L => L[0] === config[0])[0]

      if (exists && !reload) {
        [ loader, props, resolve ] = exists
      } else {
        resolve = Promise.resolve(loader(props, state)).then(data => {
          state = merge(state, data)
          return state
        })

        loaders.push([ loader, props, resolve ])
      }

      return resolve
    },
    fetch () {
      return Promise.all(
        loaders.map(([ ,, resolve ]) => resolve)
      ).then(() => state).catch(err => console.error(err))
    }
  }

  methods.setState(hydrate)

  return methods
}
