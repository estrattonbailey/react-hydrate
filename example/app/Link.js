import React from 'react'
import { Link } from 'react-router-dom'

import App from './App.js'
import { Tap, store } from 'react-hydrate'
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'

export default class AsyncLink extends Link {
  prefetch (href) {
    const ctx = {}

    renderToString(
      <StaticRouter location={href} context={ctx}>
        <Tap>
          <App />
        </Tap>
      </StaticRouter>
    )

    if (ctx.url) {
      return prefetch(ctx.url)
    }

    return store.getState()
  }

  render() {
    const { replace, to, ...props } = this.props // eslint-disable-line no-unused-vars

    const href = this.context.router.history.createHref(
      typeof to === 'string' ? { pathname: to } : to
    )

    return <a {...props} onClick={e => {
      e.preventDefault()
      e.persist()
      e.defaultPrevented = false

      this.prefetch(href).then(state => {
        this.handleClick(e)
      })
    }} href={href}/>
  }
}
