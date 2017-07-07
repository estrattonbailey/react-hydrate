import React from 'react'
import marked from 'marked'
import 'prismjs'

export default class Markdown extends React.PureComponent {
  render () {
    return (
      <div className='karla markdown' dangerouslySetInnerHTML={{
        __html: marked(this.props.string || '')
      }} />
    )
  }
}
