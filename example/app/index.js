import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { Tap } from 'react-hydrate'

/**
 * Enable hot reloading for all subsequent modules
 */
if (module.hot && process && process.env.NODE_ENV !== 'production') {
  module.hot.accept()
}

/**
 * Other app code goes below
 */
render((
  <Router>
    <Tap hydrate={window.__state || null}>
      <App />
    </Tap>
  </Router>
), document.getElementById('root'))
