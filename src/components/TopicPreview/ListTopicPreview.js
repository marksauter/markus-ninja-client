import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Link} from 'react-router-dom'
import List from 'components/mdc/List'
import Counter from 'components/Counter'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import {capitalize, get, getHandleClickLink, timeDifferenceForDate} from 'utils'

class ListTopicPreview extends React.Component {
  state = {
    anchorElement: null,
    menuOpen: false,
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  get classes() {
    const {className} = this.props
    return cls("ListTopicPreview rn-list-preview", className)
  }

  render() {
    const {anchorElement, menuOpen} = this.state
    const topic = get(this.props, "topic", {})

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <span className="mdc-list-item__graphic">
            <Icon as={Link} className="mdc-icon-button" to={topic.resourcePath} icon="topic" />
          </span>
          <Link className="mdc-list-item__text" to={topic.resourcePath}>
            <span className="mdc-list-item__primary-text">
              {capitalize(topic.name)}
            </span>
            <span className="mdc-list-item__secondary-text">
              First used
              <span className="ml1">{timeDifferenceForDate(topic.createdAt)}</span>
            </span>
          </Link>
          <span className="mdc-list-item__meta rn-list-preview__actions">
            <span className="rn-list-preview__actions--spread">
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={topic.resourcePath+"?t=course"}
                aria-label="Courses"
                title="Courses"
              >
                <Icon className="mdc-button__icon" icon="course" />
                {get(topic, "topicables.courseCount", 0)}
              </Link>
              <Link
                className="mdc-button rn-list-preview__action rn-list-preview__action--button"
                to={topic.resourcePath+"?t=study"}
                aria-label="Studies"
                title="Studies"
              >
                <Icon className="mdc-button__icon" icon="study" />
                {get(topic, "topicables.studyCount", 0)}
              </Link>
            </span>
            <Menu.Anchor className="rn-list-preview__actions--collapsed" innerRef={this.setAnchorElement}>
              <button
                type="button"
                className="mdc-icon-button material-icons"
                onClick={() => this.setState({menuOpen: !menuOpen})}
              >
                more_vert
              </button>
              <Menu
                open={menuOpen}
                onClose={() => this.setState({menuOpen: false})}
                anchorElement={anchorElement}
                anchorCorner={Corner.BOTTOM_LEFT}
              >
                <List>
                  <List.Item onClick={getHandleClickLink(topic.resourcePath+"?t=course")}>
                    <List.Item.Graphic graphic={
                      <Icon className="mdc-theme--text-icon-on-background" icon="course" />
                    } />
                    <List.Item.Text primaryText={
                      <span>
                        Courses
                        <Counter>{get(topic, "topicables.courseCount", 0)}</Counter>
                      </span>
                    }/>
                  </List.Item>
                  <List.Item onClick={getHandleClickLink(topic.resourcePath+"?t=study")}>
                    <List.Item.Graphic graphic={
                      <Icon className="mdc-theme--text-icon-on-background" icon="study" />
                    } />
                    <List.Item.Text primaryText={
                      <span>
                        Studies
                        <Counter>{get(topic, "topicables.studyCount", 0)}</Counter>
                      </span>
                    }/>
                  </List.Item>
                </List>
              </Menu>
            </Menu.Anchor>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(ListTopicPreview, graphql`
  fragment ListTopicPreview_topic on Topic {
    createdAt
    name
    resourcePath
    topicables(first: 0, type: COURSE) {
      courseCount
      studyCount
    }
  }
`)
