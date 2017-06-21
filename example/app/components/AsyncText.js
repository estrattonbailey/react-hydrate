import React from 'react'
import { Outer, Container } from 'Components/Layout'
import { hydrate } from 'react-hydrate'

class AsyncText extends React.Component {
  render () {
    const { loading, description } = this.props
    return (
      <div className="mt2">
        <p>{loading ? 'Loading text...' : description}</p>
      </div>
    )
  }
}

export default hydrate(
  props => new Promise(( resolve, reject ) => {
    console.log('AsyncText loader')
    setTimeout(() => {
      resolve({
        description: props.someProp ? (
          `You probably haven't heard of them jianbing fingerstache, hot chicken flannel palo santo cred chartreuse bicycle rights.`
        ) : (
          `Hot chicken beard godard shoreditch. Tilde typewriter godard shabby chic kombucha, chicharrones lomo pabst post-ironic adaptogen man braid +1 snackwave vegan.`
        )
      })
    }, 1000)
  })
)(AsyncText)
