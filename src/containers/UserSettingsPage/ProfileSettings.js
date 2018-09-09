import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import UserProfileForm from 'components/UserProfileForm'

const ProfileSettingsQuery = graphql`
  query ProfileSettingsQuery {
    viewer {
      ...UserProfileForm_user
    }
  }
`

class ProfileSettings extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ProfileSettings mdc-layout-grid", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ProfileSettingsQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    Public profile
                  </h4>
                  <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <UserProfileForm user={props.viewer} />
                  </div>
                </div>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default ProfileSettings