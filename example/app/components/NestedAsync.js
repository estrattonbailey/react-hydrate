import React from 'react'
import { hydrate } from 'react-hydrate'

const Nested = hydrate(
  props => new Promise((res) => {
    setTimeout(() => {
      res({
        nestedAsyncValue: props.asyncValue
      })
    }, 2000)
  }),
  state => ({
    asyncValue: state.nestedAsyncValue
  })
)(props => {
  if (props.loading) return null

  return <h4>Nested {props.asyncValue + ''}</h4>
})

export default hydrate(
  props => new Promise((res) => {
    setTimeout(() => {
      res({
        asyncValue: false
      })
    }, 2000)
  }),
  state => ({
    asyncValue: state.asyncValue
  })
)(props => {
  if (props.loading) return null

  return (
    <div>
      <h3>{props.asyncValue + ''}</h3>
      <Nested asyncValue={props.asyncValue} />
    </div>
  )
})
