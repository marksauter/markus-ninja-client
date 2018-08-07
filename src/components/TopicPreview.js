import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class TopicPreview extends Component {
  render() {
    const topic = get(this.props, "topic", {})
    return (
      <div>
        <Link to={topic.resourcePath}>
          <span>{topic.name}</span>
          <div>{topic.description}</div>
        </Link>
      </div>
    )
  }
}

export default createFragmentContainer(TopicPreview, graphql`
  fragment TopicPreview_topic on Topic {
    description
    name
    resourcePath
  }
`)
