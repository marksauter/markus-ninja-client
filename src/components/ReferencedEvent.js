import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get, timeDifferenceForDate } from 'utils'

class ReferencedEvent extends Component {
  render() {
    const event = get(this.props, "event", {})
    return (
      <div className="ReferencedEvent">
        <Link to={get(event, "user.resourcePath", "")}>@{get(event, "user.login", "")}</Link>
        <span>{event.isCrossStudy && "cross-"}referenced this {timeDifferenceForDate(event.createdAt)}</span>
        <div>
          from
          <Link to={event.resourcePath}>here</Link>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(ReferencedEvent, graphql`
  fragment ReferencedEvent_event on ReferencedEvent {
    createdAt
    id
    isCrossStudy
    resourcePath
    url
    user {
      login
      resourcePath
    }
  }
`)
