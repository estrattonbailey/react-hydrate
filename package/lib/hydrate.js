import React from 'react'
import PropTypes from 'prop-types'
import eq from 'deep-equal'

const isServer = typeof window === 'undefined'

export default (dataLoader, mapStateToProps = s => s, options = {}) => Comp => {
  const opts = {
    ssr: true,
    displayName: Comp.name || Comp.displayName,
    onError: (err, details, displayName) => {
      console.error(`react-hydrate – ${details} @ hydrate(${displayName})`, err) // eslint-disable-line no-irregular-whitespace
    },
    ...options
  }

  return class Hydrate extends React.Component {
    static contextTypes = {
      hydrate: PropTypes.shape({
        store: PropTypes.shape({
          getState: PropTypes.func.isRequired,
          addLoader: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }

    /**
     * Re-evaluate dataLoader with
     * a given set of props. This is called
     * in the event the initial mapStateToProps
     * call returns a falsy value, and when
     * props update in componentWillReceiveProps.
     */
    load (props) {
      const { addLoader } = this.context.hydrate.store

      return addLoader([ dataLoader, props ])
    }

    constructor (props, context) {
      super(props, context)

      let state = {}

      try {
        const s = mapStateToProps(this.context.hydrate.store.getState(), props)

        if (s) {
          state = {
            loading: false,
            data: s
          }
        }
      } catch (err) {
        opts.onError(err, 'mapStateToProps threw an error', opts.displayName)
      }

      this.state = {
        loading: true,
        data: null,
        ...state
      }

      /**
       * Skip loader for SSR
       */
      if (isServer && !opts.ssr) return

      /**
       * Called during SSR. On the
       * frontend, we'll just call
       * setState ASAP.
       */
      if (isServer) {
        this.componentWillMount = () => {
          this.cache && this.setState({
            loading: false,
            data: this.cache
          })
        }
      }

      /**
       * Even if data is hydrated after SSR,
       * we need to push the loader into the
       * hash so that it's in memory for
       * future load calls
       */
      this.resolver = this.load(props || {}).then(state => {
        let s

        try {
          s = mapStateToProps(state, props)
        } catch (err) {
          opts.onError(err, `mapStateToProps threw an error`, opts.displayName)
        }

        /**
         * If we're on the server,
         * set the local cache to next
         * render pass. Otherwise,
         * setState whenever the data
         * comes back.
         */
        isServer ? (
          this.cache = s
        ) : (
          this.setState({
            loading: false,
            data: s
          })
        )

        return true
      }).catch(err => {
        opts.onError(err, `dataLoader function threw an error`, opts.displayName)
      })
    }

    /**
     * Reload data if props have changed
     */
    componentWillReceiveProps (props) {
      !eq(this.props, props) && this.load(props).then(state => this.setState({
        loading: false,
        data: mapStateToProps(state, props)
      }))
    }

    render () {
      return <Comp {...this.props} {...this.state} />
    }
  }
}
