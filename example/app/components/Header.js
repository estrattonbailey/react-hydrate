import React from 'react'
// import { Link } from 'react-router-dom'
import Link from '../Link.js'

export default props => (
  <div className="flex">
    <Link to="/" className="ph1">Home</Link>
    <Link to="/about" className="ph1">About</Link>
  </div>
)
