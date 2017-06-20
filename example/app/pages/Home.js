import React from 'react'
import { Outer, Container } from 'Components/Layout'
import { hydrate } from 'react-hydrate'

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
    setTimeout(() => {
      resolve({
        description: 'This is the home page. This data was loaded asynchronously.'
      })
    }, 2000)
  })
)(Home)

export default props => (
  <Outer>
    <Container>
      <HomeWithData />
    </Container>
  </Outer>
)
