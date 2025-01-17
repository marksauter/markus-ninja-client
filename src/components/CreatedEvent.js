import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class CreatedEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreatedEvent rn-list-preview", className)
  }

  get createableType() {
    switch (get(this.props, "event.createable.__typename", "")) {
      case "Activity":
        return "course"
      case "Course":
        return "course"
      case "Lesson":
        return "lesson"
      case "Study":
        return "study"
      default:
        return ""
    }
  }

  get createableLink() {
    const createable = get(this.props, "event.createable", {})
    switch (createable.__typename) {
      case "Activity":
        return createable.name
      case "Course":
        return createable.name
      case "Lesson":
        return createable.title
      case "Study":
        return createable.name
      default:
        return ""
    }
  }

  render() {
    const {event, withUser} = this.props
    const createable = get(event, "createable")

    if (!event || !createable) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" label="Created">create</Icon>
          <span className="mdc-list-item__text">
            <span className="mdc-list-item__primary-text">
              {withUser &&
              <UserLink className="rn-link fw5" user={get(event, "user", null)} />}
              <span className="ml1">
                {withUser ? 'c' : 'C'}reated a {this.createableType}
              </span>
              <Link className="rn-link fw5 ml1" to={createable.resourcePath}>
                {this.createableLink}
              </Link>
            </span>
            <span className="mdc-list-item__secondary-text">
              Created {timeDifferenceForDate(event.createdAt)}
            </span>
          </span>
          <span className="mdc-list-item__meta">
            <Link
              className="mdc-icon-button"
              to={createable.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon={this.createableType} />
            </Link>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(CreatedEvent, graphql`
  fragment CreatedEvent_event on CreatedEvent {
    createable {
      __typename
      ...on Activity {
        name
        resourcePath
      }
      ...on Course {
        name
        resourcePath
      }
      ...on Lesson {
        resourcePath
        title
      }
      ...on Study {
        name
        resourcePath
      }
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
