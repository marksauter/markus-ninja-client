import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import UserActivityEvent from './UserActivityEvent'
import { get, isEmpty } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

class UserActivity extends Component {
  render() {
    const activityEdges = get(this.props, "user.activity.edges", [])
    if (isEmpty(activityEdges)) {
      return (
        <div className="UserActivity">
          <Link to="/new">Create a study to get started</Link>
        </div>
      )
    }
    return (
      <div className="UserActivity">
        <h3>Recent activity</h3>
        {activityEdges.map(({node}) => (
          <UserActivityEvent key={node.id} event={node} />
        ))}
        {this.props.relay.hasMore() &&
        <button
          className="mdc-button mdc-button--unelevated"
          onClick={this._loadMore}
        >
          Load more activity
        </button>}
      </div>
    )
  }

  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(EVENTS_PER_PAGE)
  }
}

export default withRouter(createPaginationContainer(UserActivity,
  {
    user: graphql`
      fragment UserActivity_user on User {
        activity(
          first: $count,
          after: $after,
          orderBy: {direction: ASC, field: CREATED_AT}
        ) @connection(key: "UserActivity_activity", filters: []) {
          edges {
            node {
              __typename
              id
              ...on AppledEvent {
                ...AppledEvent_event
              }
              ...on CreatedEvent {
                ...CreatedEvent_event
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query UserActivityForwardQuery(
        $login: String!,
        $count: Int!,
        $after: String
      ) {
        user(login: $login) {
          ...UserActivity_user
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "user.activity")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        login: props.match.params.login,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
))
