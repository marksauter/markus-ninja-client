import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import Logo from 'components/Logo'
import SignupForm from 'components/SignupForm'

class SignupPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("SignupPage mdc-layout-grid mw6 center", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <header className="pt3 pb2 tc">
              <Link className="mdc-icon-button mdc-icon-button--large" to="/">
                <Logo className="mdc-icon-button__icon" />
              </Link>
              <h4>Join us!</h4>
              <p className="mdc-typography--subtitle1">Create your account and start teaching today.</p>
            </header>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mdc-card pa4">
              <SignupForm />
            </div>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <p className="mdc-card pa3">
              <span>
                Already have an account?
                <Link
                  className="rn-link ml1"
                  to="/signin"
                >
                  Sign in.
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default SignupPage
