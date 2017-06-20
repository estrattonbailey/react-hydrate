let state = {}
let loaders = {}

export default {
  setState: obj => state = { ...state, ...obj },
  getState: () => state,
  addLoader: conf => loaders = { ...loaders, ...conf },
  getLoaders: () => loaders,
  fetch () {
    return new Promise((resolve, reject) => {
      Promise.all(
        Object.keys(loaders).map(key => {
          const { loader, props } = loaders[key]
          return Promise.resolve(loader(props)).then(data => {
            state[key] = data
          })
        })
      ).then(resolve).catch(reject)
    })
  }
}
