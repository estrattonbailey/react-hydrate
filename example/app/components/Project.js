import React from 'react'
import Link from 'react-hydrate-link'
import { Box } from 'micro-grid'

export default ({ title, caption, url, slug }) => (
  <Box width={[
    [1],
    [600, 1 / 2],
    [1050, 1 / 4]
  ]}>
    <div className='project mb2'>
      <Link to={`/oss/${slug}`}>
        <h5 className='mv0'>{title}</h5>
      </Link>
      <p className='mv0 mt025'>{caption}</p>
    </div>
  </Box>
)
