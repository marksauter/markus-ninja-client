import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from 'Environment'

const mutation = graphql`
  mutation DeleteViewerAccountMutation($input: DeleteViewerAccountInput!) {
    deleteViewerAccount(input: $input)
  }
`

export default (login, password, callback) => {
  const variables = {
    input: {
      login,
      password,
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      updater: proxyStore => {
        const userId = proxyStore.getRootField('deleteViewerAccount')
        proxyStore.delete(userId)
      },
      onCompleted: callback,
      onError: err => console.error(err),
    },
  )
}