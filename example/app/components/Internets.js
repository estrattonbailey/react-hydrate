import React from 'react'
import { Flex } from 'micro-grid'
import Internet from 'Components/Internet'
import { hydrate } from 'react-hydrate'
import api from 'Util/api'

const Internets = ({ internets }) => {
  return (
    <Flex gutter={1.5} wrap>
      {internets && internets.map(i => (
        <Internet {...i} key={i.url} />
      ))}
    </Flex>
  )
}

export default hydrate(
  props => {
    return api.getEntries({
      content_type: 'internet',
      order: '-sys.createdAt'
    }).then(({ items }) => {
      return {
        internets: items.map(item => item.fields)
      }
    }).catch(err => console.error('Internets', err))
  },
  state => ({
    internets: state.internets
  })
)(Internets)
