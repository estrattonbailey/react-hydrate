import React from 'react'
import PropTypes from 'prop-types'

export default dataLoader => Comp => {
  return class ComponentProvider extends React.Component {
    static contextTypes = {
      hydrate: PropTypes.shape({
        store: PropTypes.shape({
          getState: PropTypes.func.isRequired,
          setState: PropTypes.func.isRequired,
          addLoader: PropTypes.func.isRequired,
          getHash: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }

    constructor (props, context) {
      super(props, context)

      this.state = {
        loading: true
      }

      this.id = Comp.name
      this.store = this.context.hydrate.store
    }

    componentWillMount () {
      const {
        getState,
        setState,
        addLoader,
        getHash
      } = this.store

      /**
       * Synchronous. Check if
       * the loader exists on the
       * store. If not, add it.
       */
      if (!getHash()[this.id]) {
        addLoader({
          [this.id]: {
            loader: dataLoader,
            props: this.props
          }
        })
      }

      getState().then(state => {
        if (state[this.id]) {
          this.setState({
            loading: false,
            ...state[this.id]
          })
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
      })
    }

    componentWillReceiveProps (props) {
      const { addLoader } = this.store

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
