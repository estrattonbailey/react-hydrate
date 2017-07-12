# react-hydrate
Generic data fetching and SSR hydration pattern for React.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features & Goals
1. Co-locate data dependencies with your components
2. Supports inifinitely nested loaders
3. Fetches requested data on the server and hydrates on the client for a fast startup
4. Wraps components so users can easily define loading states for components
5. Routing agnostic. **Works with `react-router` v4.**
6. Lightweight **~1.9kb**

## Usage
### Defining components
```javascript
/**
 * Projects.js
 */
import api from 'my-api'
import { hydrate } from 'react-hydrate'
import Project from './Project.js'

export default hydrate(
  /**
   * dataLoader receives component props
   * and any state already in the store
   */
  (props, state) => {
    return api.fetchProjects().then(projects => {
      return {
        projects: projects
      }
    })
  },
  /**
   * mapStateToProps receives the
   * loaded data via `state` and any
   * component props.
   *
   * You should return `false` here if 
   * the data needed is not yet availabe.
   * If a falsy value is returned, it
   * tells the library that the loader
   * hasn't been run yet or hasn't
   * yet resolved.
   */
  (state, props) => {
    return state.projects ? {
      data: state.projects
    } : false
  }
)(props => {
  /**
   * Component is always passed a loading
   * prop that represents the status of their
   * dataLoader function
   */
  return props.loading ? (
    <div>Loading data...</div>
  ) : (
    props.data.map(project => <Project {...project} key={project.slug}>)
  )
})
```

```javascript
/**
 * App.js
 */
import React from 'react'
import Projects from './Projects.js'

export default props => (
  <div>
    <Projects />
  </div>
)
```

### Creating root app
```javascript
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Tap } from 'react-hydrate'
import App from './App'

render((
  <Router>
    <Tap hydrate={window.__hydrate || null}>
      <App />
    </Tap>
  </Router>
), document.getElementById('root'))
```

### Server
```javascript
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter: Router } from 'react-router'
import { Tap, createStore } from 'react-hydrate'
import { asyncRender } from 'react-hydrate/server'
import App from './App.js'

app.use((req, res) => {
  const ctx = {}
  const store = createStore({})

  const Root = (
    <Router location={req.url} context={ctx}>
      <Tap hydrate={store}>
        <App />
      </Tap>
    </Router>
  )

  asyncRender(Root).then(() => {
    const state = store.getState()
    const content = renderToString(Root)

    if (ctx.url) {
      res.writeHead(302, {
        Location: ctx.url
      })
      res.end()
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head></head>
          <body>
            ${content}
            <script>
              window.__hydrate = ${JSON.stringify(state)}
            </script>
            <script src="/index.js"></script>
          </body>
        </html>
      `)
      res.end()
      store.clearState()
    }
  })
})
```

## Caveats
Like other route-agnostic data loading libraries, `react-hydrate` needs to run a *blind render* to gather data dependencies. Then, once the data is fetched, run another render pass with the data in place. This second render is then sent down to the client. With the upcoming release of Fiber, we may be able to do this with only a single render, but for now *I think* this is as good as we can do.

MIT License
