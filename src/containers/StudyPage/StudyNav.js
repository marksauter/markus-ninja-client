import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Link, matchPath, withRouter } from 'react-router-dom'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get } from 'utils'

class StudyNav extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const { study } = this.props
    const pathname = get(this.props, "location.pathname", "")
    const studyPath = "/:owner/:name"

    return (
      <TabBar className={this.classes}>
        <Tab
          minWidth
          active={matchPath(pathname, { path: studyPath, exact: true })}
          as={Link}
          to={study.resourcePath}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Overview
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={matchPath(pathname, { path: studyPath+"/lessons", exact: true })}
          as={Link}
          to={study.resourcePath + "/lessons"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="lesson" />
            <span className="mdc-tab__text-label">
              Lessons
              <Counter>{get(study, "lessons.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={matchPath(pathname, { path: studyPath+"/courses", exact: true })}
          as={Link}
          to={study.resourcePath + "/courses"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="course" />
            <span className="mdc-tab__text-label">
              Courses
              <Counter>{get(study, "courses.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={matchPath(pathname, { path: studyPath+"/assets", exact: true })}
          as={Link}
          to={study.resourcePath + "/assets"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="asset" />
            <span className="mdc-tab__text-label">
              Assets
              <Counter>{get(study, "assets.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        {study.viewerCanAdmin &&
        <Tab
          minWidth
          active={matchPath(pathname, { path: studyPath+"/settings", exact: true })}
          as={Link}
          to={study.resourcePath + "/settings"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon">settings</Icon>
            <span className="mdc-tab__text-label">
              Settings
            </span>
          </span>
        </Tab>}
      </TabBar>
    )
  }
}

export default withRouter(createFragmentContainer(StudyNav, graphql`
  fragment StudyNav_study on Study {
    assets(first: 0) {
      totalCount
    }
    courses(first: 0) {
      totalCount
    }
    lessons(first: 0) {
      totalCount
    }
    resourcePath
    viewerCanAdmin
  }
`))
