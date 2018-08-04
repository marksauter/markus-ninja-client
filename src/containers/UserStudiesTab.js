import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyPreview from 'components/StudyPreview.js'
import { get, isEmpty } from 'utils'
import { STUDIES_PER_PAGE } from 'consts'

const UserStudiesPageQuery = graphql`
  query UserStudiesPageQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      studies(first: $count, orderBy:{direction: DESC field:CREATED_AT})
        @connection(key: "UserStudiesPage_studies", filters: []) {
        edges {
          node {
            ...StudyPreview_study
          }
        }
      }
    }
  }
`

class UserStudiesPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserStudiesPageQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const studyEdges = get(props, "user.studies.edges", [])
            if (isEmpty(studyEdges)) {
              return (
                <div className="UserActivity">
                  {props.user.isViewer
                  ? <Link to="/new">Create a study to get started</Link>
                  : <span>This user has not created and studies yet.</span>}
                </div>
              )
            }
            return (
              <div>
                {studyEdges.map(({node}) => (
                  <StudyPreview key={node.__id} study={node} />
                ))}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserStudiesPage)