import {
  commitMutation,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'

const mutation = graphql`
  mutation RequestEmailVerificationMutation($input: RequestEmailVerificationInput!) {
    requestEmailVerification(input: $input)
  }
`

export default (email, callback) => {
  const variables = {
    input: {
      email,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        callback(response.requestEmailVerification, error)
      },
      onError: err => callback(null, err),
    },
  )
}
