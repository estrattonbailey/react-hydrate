import React from 'react'
import PropTypes from 'prop-types'

export default dataLoader => Comp => {
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

    constructor (props, context) {
      super(props, context)

      this.id = Comp.name

      const state = this.context.hydrate.store.getState()

      this.state = state[this.id] ? {
        loading: false,
        ...state[this.id]
      } : { loading: true }

      !state[this.id] && this.load()
    }

    load (newProps = null) {
      const {
        setState,
        getState,
        addLoader
      } = this.context.hydrate.store

      const state = getState()

      if (!state[this.id] || newProps) {
        addLoader({
          [this.id]: {
            loader: dataLoader,
            props: newProps || this.props
          }
        }).then(state => {
          setState({
            [this.id]: state
          })

          return state
        }).then(state => {
          this.cache = state

          return state
        })
      }
    }

    componentWillMount () {
      if (this.cache) {
        this.setState({
          loading: false,
          ...this.cache
        })
      }
    }

    componentWillReceiveProps (props) {
      this.load(props).then(state => this.setState(state))
    }

    render () {
      return (
        <Comp {...this.props} {...this.state} />
      )
    }
  }
}






import React from 'react'
import PropTypes from 'prop-types'

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

      return addLoader([
        dataLoader,
        props
      ])
    }

    constructor (props, context) {
      super(props, context)

      let state = {}

      try {
        state = {
          loading: false,
          ...mapStateToProps(
            this.context.hydrate.store.getState()
          )
        }
      } catch (e) {
        this.load(props).then(state => {
          this.cache = state
        })
      }

      this.state = {
        loading: true,
        ...state
      }
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
        ...state
      }))
    }

    render () {
      return (
        <Comp {...this.props} {...this.state} />
      )
    }
  }
}
