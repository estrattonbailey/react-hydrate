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
    }

    componentWillMount () {
      const {
        getState,
        setState,
        getLoaders,
        addLoader
      } = store

      const state = getState()
      const loaders = getLoaders()

      const id = Comp.name
      const hydrate = state[id]

      if (!loaders[id]) {
        addLoader({
          [id]: {
            loader: dataLoader,
            props: this.props,
            loaded: false
          }
        })
      }

      if (hydrate) {
        this.setState({
          loading: false,
          ...hydrate
        })
      } else {
        Promise.resolve(dataLoader(this.props)).then(data => {
          setState({
            [id]: data
          })

          this.setState({
            loading: false,
            ...data
          })
        })
      }
    }

    render () {
      return (
        <Comp {...this.props} {...this.state} />
      )
    }
  }
}
