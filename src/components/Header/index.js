import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { isAuthenticated } from 'auth'
import LoginLink from 'components/LoginLink'
import SearchBar from './SearchBar'
import AuthLinks from './AuthLinks'

import './Header.css'

class Header extends Component {
  render() {
    const authenticated = isAuthenticated()
    return (
      <div className="Header">
        <div className="Header__links">
          <Link className="Header__link" to="/">Home</Link>
          <SearchBar />
          <Link className="Header__link" to="/research">Research</Link>
          {!authenticated &&
          <ul>
            <li>
              <LoginLink className="Header__link">Login</LoginLink>
            </li>
            <li>
              <Link className="Header__link" to="/signup">Signup</Link>
            </li>
          </ul>}
          {authenticated && <AuthLinks />}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
