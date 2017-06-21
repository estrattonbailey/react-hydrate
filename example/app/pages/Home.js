import React from 'react'
import { Outer, Container } from 'Components/Layout'
import { hydrate } from 'react-hydrate'
import AsyncText from 'Components/AsyncText'

class Home extends React.Component {
  render () {
    const { loading, description } = this.props
    return (
      <div>
        <h1>Home</h1>
        <p>{loading ? 'Loading description...' : description}</p>
      </div>
    )
  }
}

const HomeWithData = hydrate(
  props => new Promise(( resolve, reject ) => {
    console.log('Home loader')
    setTimeout(() => {
      resolve({
        description: 'This is the home page. This data was loaded asynchronously.'
      })
    }, 2000)
  })
)(Home)

export default class extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      bool: true
    }
  }

  componentDidMount () {
    // setTimeout(() => {
    //   this.setState({
    //     bool: false
    //   })
    // }, 100)
  }

  render () {
    return (
      <Outer>
        <Container>
          <HomeWithData />
          <AsyncText someProp={this.state.bool} />
        </Container>
      </Outer>
    )
  }
}
