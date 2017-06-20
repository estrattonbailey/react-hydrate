import React from 'react'

export const Outer = ({ children }) => (
  <div className='outer'>
    {children}
  </div>
)

export const Container = ({ children }) => (
  <div className='container mha'>
    {children}
  </div>
)
