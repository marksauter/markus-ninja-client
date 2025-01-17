import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { get } from 'utils'

const mutation = graphql`
  mutation CreateStudyMutation($input: CreateStudyInput!) {
    createStudy(input: $input) {
      studyEdge {
        node {
          id
          createdAt
          description
          name
          resourcePath
        }
      }
    }
  }
`

export default (name, description, callback) => {
  const variables = {
    input: {
      description,
      name,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        const study = get(response, "createStudy.studyEdge.node")
        callback(study, error)
      },
      onError: err => callback(null, err),
    },
  )
}
