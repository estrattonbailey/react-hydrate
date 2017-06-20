const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter: Router } = require('react-router')

const html = require('./html.js')
const App = require('../app/App.js').default
const { Tap, store } = require('react-hydrate')
const { getCSS } = require('micro-grid')

module.exports = (req, res) => {
  const ctx = {}

  const render = () => renderToString(
    <Router location={req.url} context={ctx}>
      <Tap>
        <App />
      </Tap>
    </Router>
  )

  const pre = render()

  if (ctx.url) {
    res.writeHead(302, {
      Location: ctx.url
    })
    res.end()
  } else {
    store.fetch().then(data => {
      res.send(html(render(), store.getState(), getCSS()))
      res.end()
    })
  }
}
