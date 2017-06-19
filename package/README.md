# react-hydrate
Asynchronous data fetching in React SSR environments.

**Proof of concept:** working on a new personal site and boilerplate [over here](https://github.com/estrattonbailey/root/blob/master/server/router.js).

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Purpose
This libary does one thing: fetches all the data needed for a given view so that the app can render a complete page on a cold load. Then, when the app boots up (assuming javascript is enabled), `react-hydrate` can hydrate the rendered components to prevent *re-fetching* of the data.

As subsequent components render – say after a route change - `react-hydrate` simply passes a loading prop so that you can configure a loader for each view.

## Usage
```javascript
/**
 * index.js
 * 
 * Wrap root node with Tap context
 * provider. Hydrate state from wherever
 * state was stored on window during SSR.
 */
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

/**
 * App.js
 *
 * On first load, this component will
 * already have it's `title` prop available
 * to it because it was hydrated on the server.
 * 
 * If this component was rendered after the
 * initial load – like on a route change –
 * it will show 'Loading...' until the loading
 * function resolves with data.
 */
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

/**
 * server.js
 *
 * Wrap root node with Tap context provider.
 *
 * After the initial render, the `store`
 * export from the main package contains
 * all the component's loaders. Calling
 * `store.fetch()` returns a promise that resolves
 * to the fetched data.
 * 
 * `store.state` then contains the data needed
 * to hydrate the application. Attach it to the window
 * where needed.
 */
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

