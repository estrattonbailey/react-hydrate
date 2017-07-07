import React from 'react'
import { Route } from 'react-router-dom'

import Home from 'Pages/Home'
import ProjectPage from 'Pages/ProjectPage'

export default class App extends React.Component {
  constructor (p) {
    super(p)

    this.state = {}
  }

  render () {
    return (
      <div>
        <Route exact path='/' component={Home} />
        <Route path='/oss/:slug' component={ProjectPage} />
      </div>
    )
  }
}
