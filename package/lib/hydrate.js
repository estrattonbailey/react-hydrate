import React from 'react'
import PropTypes from 'prop-types'
import eq from 'deep-equal'

const isServer = typeof window === 'undefined'

export default (dataLoader, mapStateToProps = s => s) => Comp => {
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
            ...s
          }
        } else {
          throw '' // user defined mapStateToProps returned falsy
        }
      } catch (e) {}

      this.state = {
        loading: true,
        ...state
      }


      /**
       * Called during SSR. On the
       * frontend, we'll just call
       * setState ASAP.
       */
      if (isServer) {
        this.componentWillMount = () => {
          this.cache && this.setState({
            loading: false,
            ...this.cache
          })
        }
      }

      /**
       * Even if data is hydrated after SSR,
       * we need to push the loader into the
       * hash so that it's in memory for
       * future load calls
       */
      this.load(props || {}).then(state => {
        const s = mapStateToProps(state, props)

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
            ...s
          })
        )
      })
    }

    /**
     * Reload data if props have changed
     */
    componentWillReceiveProps (props) {
      !eq(this.props, props) && this.load(props).then(state => this.setState({
        loading: false,
        ...mapStateToProps(state, props)
      }))
    }

    render () {
      return <Comp {...this.props} {...this.state} />
    }
  }
}
