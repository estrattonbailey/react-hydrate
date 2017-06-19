import React from 'react'
import P from 'prop-types'
import store from './store.js'

const isServer = typeof window === 'undefined'

export default (loader, mapStateToProps) => Comp => {
  return class ComponentProvider extends React.Component {
    static contextTypes = {
      store: P.object
    }

    constructor (props, context) {
      super(props, context)

      this.state = {
        loading: true
      }
    }

    componentWillMount () {
      const { state, loaders } = this.context.store

      if (state.loaded) {
        return this.setState({
          loading: false,
          ...mapStateToProps(state.data)
        })
      }

      if (isServer) {
        const index = loaders.indexOf(loader)

        this.loaderIndex = index < 0 ? (
          loaders.push([loader, this.props]) - 1
        ) : index
      } else {
        Promise.resolve(loader(this.props)).then(data => {
          state.data = {
            ...state.data,
            ...data
          }

          this.setState({
            loading: false,
            ...mapStateToProps(state.data)
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
