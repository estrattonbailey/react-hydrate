import eq from 'deep-equal'

export default (hydrate = {}) => {
  let state = hydrate
  let loaders = []

  const methods = {
    getState () {
      return state
    },
    clearState () {
      state = {}
      loaders = []
    },

    /**
     * Add a loader and props to
     * the loader hash.
     *
     * @param {array} config [ loader, props ] signature
     */
    addLoader (config) {
      let resolve
      let [ loader, props ] = config

      /**
       * Check for loader fn() equality,
       * then check if props match. If both,
       * then we've loaded this data before
       */
      const exists = loaders.filter(L => {
        if (L[0] === loader) {
          return eq(L[1], props)
        }

        return false
      })[0]

      /**
       * If it exists, just
       * return the resolved promise.
       * Otherwise, create new resolve
       * value and push to loaders array.
       * Return promise to component
       * to hydrate once resolved.
       */
      if (exists) {
        [ loader, props, resolve ] = exists
      } else {
        resolve = Promise.resolve(loader(props, state))
          .then(data => {
            state = {
              ...state,
              ...data
            }
            return state
          })
          .catch(err => console.error('addLoader resolve returned an error', err))

        loaders.push([ loader, props, resolve ])
      }

      return resolve
    },

    /**
     * Extract each resolver function
     * and wait for it to return
     */
    fetch () {
      return Promise.all(
        loaders.map(([ ,, resolve ]) => resolve)
      ).then(() => state).catch(err => console.error(err))
    }
  }

  return methods
}
