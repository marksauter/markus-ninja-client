import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import CreateLessonForm from 'components/CreateLessonForm'

const CreateLessonPageQuery = graphql`
  query CreateLessonPageQuery($owner: String!, $name: String!) {
    study(owner: $owner, name: $name) {
      ...CreateLessonForm_study
    }
  }
`

class CreateLessonPage extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={CreateLessonPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <CreateLessonForm study={props.study}></CreateLessonForm>
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default CreateLessonPage
