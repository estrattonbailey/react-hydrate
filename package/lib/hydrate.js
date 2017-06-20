import React from 'react'
import P from 'prop-types'
import store from './store.js'

export default dataLoader => Comp => {
  return class ComponentProvider extends React.Component {
    constructor (props, context) {
      super(props, context)

      this.state = {
        loading: true
      }

      this.id = Comp.name
    }

    componentWillMount () {
      const {
        getState,
        setState,
        addLoader
      } = store

      const state = getState()
      const hydrate = state[this.id]

      if (!hydrate) {
        addLoader({
          [this.id]: {
            loader: dataLoader,
            props: this.props
          }
        })
      }

      if (hydrate) {
        hydrate.then ? (
          hydrate.then(data => {
            this.setState({
              loading: false,
              ...data
            })
          })
        ) : (
          this.setState({
            loading: false,
            ...hydrate
          })
        )
      } else {
        Promise.resolve(dataLoader(this.props)).then(data => {
          setState({
            [this.id]: data
          })

          this.setState({
            loading: false,
            ...data
          })
        })
      }
    }

    componentWillReceiveProps (props) {
      const { addLoader } = store

      addLoader({
        [this.id]: {
          loader: dataLoader,
          props: props
        }
      }).then(data => this.setState(data))
    }

    render () {
      return (
        <Comp {...this.props} {...this.state} />
      )
    }
  }
}
