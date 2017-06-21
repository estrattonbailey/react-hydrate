import React from 'react'
import PropTypes from 'prop-types'
import createStore from './store.js'

export default class Tap extends React.Component {
  static childContextTypes = {
    hydrate: PropTypes.shape({
      store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        setState: PropTypes.func.isRequired,
        clearState: PropTypes.func.isRequired,
        addLoader: PropTypes.func.isRequired
      }).isRequired,
      root: PropTypes.object.isRequired,
      hydrateStore: PropTypes.func.isRequired
    }).isRequired
  }

  getChildContext () {
    return {
      hydrate: {
        store: this.store,
        root: this.props.children,
        hydrateStore: this.hydrateStore.bind(this)
      }
    }
  }

  constructor (props) {
    super(props)

    const {
      hydrate = {}
    } = this.props

    this.hydrateStore(hydrate)
  }

  hydrateStore (hydrate) {
    this.store = hydrate.getState ? hydrate : createStore(hydrate)
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
