import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Select from '@material/react-select'
import Snackbar from 'components/mdc/Snackbar'
import UpdateEmailMutation from 'mutations/UpdateEmailMutation'
import {get} from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerPrimaryEmail extends React.Component {
  constructor(props) {
    super(props)

    let value = ""
    for (let edge of get(props, "viewer.primaryEmailOptions.edges", [])) {
      const type = get(edge, "node.type", "")
      if (type === 'PRIMARY') {
        value = get(edge, "node.id", "")
      }
    }

    this.state = {
      initialValue: value,
      value,
      error: null,
      showSnackbar: false,
      snackbarMessage: "",
    }
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

    relay.loadMore(EMAILS_PER_PAGE)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {initialValue, value} = this.state
    UpdateEmailMutation(
      value,
      'PRIMARY',
      (email, errors) => {
        if (errors) {
          this.setState({
            errors: errors[0].message,
            value: initialValue,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Primay email updated",
        })
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("ViewerPrimaryEmail", className)
  }

  get options() {
    const emailEdges = get(this.props, "viewer.primaryEmailOptions.edges", [])
    const options = []
    emailEdges.map(({node}) => node && options.push({
      label: node.value,
      value: node.id,
    }))

    return options
  }

  render() {
    const {showSnackbar, snackbarMessage, value} = this.state

    return (
      <div className={this.classes}>
        <p className="mb2">
          Your primary email address, in addition to authentication, will be used for account-related notifications.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div>
            <Select
              className="rn-select"
              floatingLabelClassName="mdc-floating-label--float-above"
              label="Primary email address"
              value={value}
              onChange={(e) => this.setState({value: e.target.value})}
              options={this.options}
            />
          </div>
          <button
            className="mdc-button mdc-button--unelevated mt2"
            type="submit"
          >
            Save
          </button>
        </form>
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => {this.setState({showSnackbar: false})}}
          actionText="ok"
          handleHide={() => {this.setState({showSnackbar: false})}}
        />
      </div>
    )
  }
}

export default createPaginationContainer(ViewerPrimaryEmail,
  {
    viewer: graphql`
      fragment ViewerPrimaryEmail_viewer on User {
        primaryEmailOptions: emails(
          after: $after,
          first: $count,
          filterBy:{isVerified: true},
        ) @connection(key: "ViewerPrimaryEmail_primaryEmailOptions") {
          edges {
            node {
              id
              type
              value
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
      query ViewerPrimaryEmailForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerPrimaryEmail_viewer
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "viewer.emails")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
