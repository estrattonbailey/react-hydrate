import React from 'react'
import PropTypes from 'prop-types'
import eq from '@f/equal-obj'

const isServer = typeof window === 'undefined'

export default (
  dataLoader,
  mapStateToProps = s => s
) => Comp => {
  return class ComponentProvider extends React.Component {
    static contextTypes = {
      hydrate: PropTypes.shape({
        store: PropTypes.shape({
          getState: PropTypes.func.isRequired,
          setState: PropTypes.func.isRequired,
          addLoader: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }

    load (props) {
      const { addLoader } = this.context.hydrate.store

      return addLoader(
        [ dataLoader, props ],
        !eq(this.props, props)
      )
    }

    constructor (props, context) {
      super(props, context)

      let state = {}

      try {
        state = {
          loading: false,
          ...mapStateToProps(this.context.hydrate.store.getState(), props)
        }
      } catch (e) {}

      this.state = {
        loading: true,
        ...state
      }

      this.load(props || {}).then(state => {
        const mappedState = mapStateToProps(state, props)

        /**
         * If we're on the server,
         * set the local cache to next
         * render pass. Otherwise,
         * setState whenever the data
         * comes back.
         */
        isServer ? (
          this.cache = mappedState
        ) : (
          this.setState({
            loading: false,
            ...mappedState
          })
        )
      })
    }

    componentWillMount () {
      this.cache && this.setState({
        loading: false,
        ...this.cache
      })
    }

    componentWillReceiveProps (props) {
      this.load(props).then(state => this.setState({
        loading: false,
        ...mapStateToProps(state, props)
      }))
    }

    render () {
      return (
        <Comp {...this.props} {...this.state} />
      )
    }
  }
}
