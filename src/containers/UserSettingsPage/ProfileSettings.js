import * as React from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import UserProfileForm from './UserProfileForm'

const ProfileSettingsQuery = graphql`
  query ProfileSettingsQuery {
    viewer {
      ...UserProfileForm_user
    }
  }
`

class ProfileSettings extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ProfileSettingsQuery}
        render={({error,  props}) => {
          if (error) {
            return (
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                {error.message}
              </div>
            )
          } else if (props) {
            return (
              <React.Fragment>
                <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  Public profile
                </h4>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserProfileForm user={props.viewer} />
                </div>
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default ProfileSettings
