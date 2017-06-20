import React from 'react'
import { Route, Link } from 'react-router-dom'

import Header from 'Components/Header'
import Home from 'Pages/Home'
import About from 'Pages/About'

export default class App extends React.Component {
  constructor (p) {
    super(p)

    this.state = {}
  }

  render () {
    return (
      <div>
        <Header />
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
      </div>
    )
  }
}
