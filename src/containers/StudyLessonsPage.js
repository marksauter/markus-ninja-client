import React, {Component} from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import environment from 'Environment'
import CreateLessonLink from 'components/CreateLessonLink'
import StudyLabelsLink from 'components/StudyLabelsLink'
import SearchStudyLessonsInput from 'components/SearchStudyLessonsInput'
import LessonPreview from 'components/LessonPreview.js'
import { get, isEmpty, isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const StudyLessonsPageQuery = graphql`
  query StudyLessonsPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String,
    $query: String!,
    $within: ID!
  ) {
    ...SearchStudyLessonsInput_query @arguments(
      owner: $owner,
      name: $name,
      count: $count,
      after: $after,
      query: $query,
      within: $within,
    )
    study(owner: $owner, name: $name) {
      ...CreateLessonLink_study
      ...StudyLabelsLink_study
      ...SearchStudyLessonsInput_study
      resourcePath
    }
  }
`

class StudyLessonsPage extends Component {
  state = {
    hasMore: false,
    lessonEdges: [],
    loadMore: () => {},
  }

  get classes() {
    const {className} = this.props
    return cls("StudyLessonsPage pt3", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyLessonsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LESSONS_PER_PAGE,
          query: "*",
          within: get(this.props, "study.id"),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return null
            }
            const {hasMore, lessonEdges, loadMore} = this.state
            return (
              <div className={this.classes}>
                <div className="flex items-center">
                  <SearchStudyLessonsInput
                    className="flex-auto mr4"
                    query={props}
                    study={props.study}
                    onQueryComplete={(lessonEdges, hasMore, loadMore) =>
                      this.setState({ hasMore, lessonEdges, loadMore })
                    }
                  />
                  <StudyLabelsLink
                    className="mdc-button mdc-button--unelevated mr2"
                    study={props.study}
                  >
                    Labels
                  </StudyLabelsLink>
                  <Link
                    className="mdc-button mdc-button--unelevated"
                    to={props.study.resourcePath + "/lessons/new"}
                  >
                    New lesson
                  </Link>
                </div>
                {isEmpty(lessonEdges)
                ? <React.Fragment>
                    <span className="mr1">
                      No lessons were found.
                    </span>
                    <CreateLessonLink className="rn-link rn-link--on-surface" study={props.study}>
                      Create a lesson.
                    </CreateLessonLink>
                  </React.Fragment>
                : <div className="StudyLessons__lessons">
                    {lessonEdges.map(({node}) => (
                      node && <LessonPreview key={node.id} lesson={node} />
                    ))}
                    {hasMore &&
                    <button
                      className="mdc-button mdc-button--unelevated"
                      onClick={loadMore}
                    >
                      More
                    </button>}
                  </div>
                }
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default createFragmentContainer(StudyLessonsPage, graphql`
  fragment StudyLessonsPage_study on Study {
    id
  }
`)
