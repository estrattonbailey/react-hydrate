# react-hydrate

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Usage
```javascript
// index.js
import App from './App.js'
import { Tap } from 'react-hydrate'

const Root = props => (
  <Tap initialState={window.__state || null}>
    <App />
  </Tap>
)

render(
  <Root />,
  document.getElementById('root')
)

// App.js
const App = ({ loading, title }) => (
  <h1>{loading ? 'Loading...' : title}</h1>
)

export default hydrate(
  props => {
    /* hit an API, process data */
    return { someOtherProp: 'Hello world!' }
  },
  state => ({
    title: state.someOtherProp
  })
)(App)

// server.js
import { renderToString } from 'react-dom'
import { Tap, store } from 'react-hydrate'
import App from './App.js'

app.use((req, res) => {
  const content = renderToString(
    <Tap>
      <App />
    </Tap>
  )

  store.fetch().then(data => {
    res.write(`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          ${content}
          <script>
            window.__state = ${JSON.stringify(store.state)}
          </script>
          <script src="/index.js"></script>
        </body>
      </html>
    `)
    res.end()
  })
})
```

MIT License

