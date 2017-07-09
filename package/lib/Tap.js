import React from 'react'
import PropTypes from 'prop-types'
import createStore from './store.js'

export default class Tap extends React.Component {
  static childContextTypes = {
    hydrate: PropTypes.shape({
      store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
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

    /**
     * Create new store with hydrated
     * store or an empty object
     */
    this.hydrateStore(hydrate)
  }

  /**
   * This needs to allow you to pass
   * a "hot" store (one already in memory)
   * in order to prefetch data, hence the
   * check for the `getState` method.
   * Otherwise, we're just creating a
   * fresh store here.
   */
  hydrateStore (hydrate = {}) {
    this.store = hydrate.getState ? hydrate : createStore(hydrate)
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
