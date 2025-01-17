import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'utils'
import UpdateStudyNameForm from './UpdateStudyNameForm'
import StudyDangerZone from './StudyDangerZone'

class StudySettings extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudySettings mdc-layout-grid__inner", className)
  }

  render() {
    const study = get(this.props, "study", null)
    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">Settings</h5>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <h6 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Study name
        </h6>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <UpdateStudyNameForm study={study} />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <StudyDangerZone study={study} />
        </div>
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(StudySettings, graphql`
  fragment StudySettings_study on Study {
    ...StudyDangerZone_study
    ...UpdateStudyNameForm_study
  }
`)
