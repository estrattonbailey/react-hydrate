const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter: Router } = require('react-router')

const html = require('./html.js')
const App = require('../app/App.js').default
const { Tap, createStore } = require('react-hydrate')
const { getCSS } = require('micro-grid')

module.exports = (req, res) => {
  const ctx = {}
  const store = createStore({})

  const render = () => renderToString(
    <Router location={req.url} context={ctx}>
      <Tap hydrate={store}>
        <App />
      </Tap>
    </Router>
  )

  render()

  if (ctx.url) {
    res.writeHead(302, {
      Location: ctx.url
    })
    res.end()
  } else {
    store.fetch().then(state => {
      res.send(html(render(), state, getCSS()))
      res.end()
      store.clearState()
    })
  }
}
