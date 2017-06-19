export default {
  state: {
    loaded: false,
    data: {}
  },
  loaders: [],
  fetch () {
    return new Promise((resolve, reject) => {
      Promise.all(this.loaders.map(([loader, props]) => loader(props))).then(data => {
        this.state.data = data.reduce((res, datum) => {
          return {
            ...res,
            ...datum
          }
        }, {})

        this.state.loaded = true

        resolve(data)
      })
    })
  }
}
