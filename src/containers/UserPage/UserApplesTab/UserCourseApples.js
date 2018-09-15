import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import CoursePreview from 'components/CoursePreview'
import {get, isEmpty} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class UserCourseApples extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(USERS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("UserCourseApples mdc-layout-grid__inner", className)
  }

  render() {
    const user = get(this.props, "user", null)
    const appledEdges = get(user, "appledCourses.edges", [])
    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Appled courses
        </h5>
        {isEmpty(appledEdges)
        ? (user.isViewer
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              You have not appled any courses yet.
              While you're researching different courses, you can give apples
              to those you like.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No apples found.
            </div>)
        : <React.Fragment>
            {appledEdges.map(({node}) => (
              node &&
              <React.Fragment key={node.id}>
                <CoursePreview.Apple
                  className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                  course={node}
                />
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
              </React.Fragment>
            ))}
            {this.props.relay.hasMore() &&
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={this._loadMore}
              >
                More
              </button>
            </div>}
          </React.Fragment>}
      </div>
    )
  }
}

export default createPaginationContainer(UserCourseApples,
  {
    user: graphql`
      fragment UserCourseApples_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        appledCourses: appled(
          first: $count,
          after: $after,
          orderBy: {direction: DESC field: APPLED_AT}
          type: COURSE
        ) @connection(key: "UserCourseApples_appledCourses", filters: []) {
          edges {
            node {
              id
              ...on Course {
                ...CoursePreview_course
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        isViewer
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query UserCourseApplesForwardQuery(
        $login: String!,
        $count: Int!,
        $after: String
      ) {
        user(login: $login) {
          ...UserCourseApples_user @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "user.appled")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)