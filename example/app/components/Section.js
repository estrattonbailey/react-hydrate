import React from 'react'
import SectionTitle from 'Components/SectionTitle'

export default ({ title, children }) => (
  <section className='pb2'>
    <SectionTitle title={title} />
    {children}
  </section>
)
