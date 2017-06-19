import React from 'react'
import P from 'prop-types'
import store from './store.js'

export default class Tap extends React.Component {
  static childContextTypes = {
    store: P.object
  }

  getChildContext () {
    return {
      store,
    }
  }

  constructor (props) {
    super(props)

    store.state = {
      ...store.state,
      ...(this.props.initialState || {})
    }
  }

  componentDidMount () {
    store.state.loaded = false
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
