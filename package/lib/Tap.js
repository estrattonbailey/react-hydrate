import React from 'react'
import store from './store.js'

const { setState } = store

export default class Tap extends React.Component {
  constructor (props) {
    super(props)

    const { initialState = {} } = this.props

    setState(initialState)
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
