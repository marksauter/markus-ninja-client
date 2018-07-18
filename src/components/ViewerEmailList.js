import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import ViewerEmail from './ViewerEmail.js'
import AddEmailMutation from 'mutations/AddEmailMutation'
import { get, isNil } from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerEmailList extends Component {
  state = {
    addEmail: "",
    error: null,
  }

  render() {
    const emailEdges = get(this.props, "viewer.allEmails.edges", [])
    const { addEmail } = this.state
    return (
      <div className="ViewerEmailList">
        <div className="ViewerEmailList__emails">
          {emailEdges.map(({node}) => (
            <ViewerEmail key={node.__id} email={node} />
          ))}
          <button
            className="ViewerEmailList__more"
            onClick={this._loadMore}
          >
            More
          </button>
        </div>
        <div className="ViewerEmailList__add">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="viewer_add_email">Add email address</label>
            <input
              id="viewer_add_email"
              className="form-control"
              type="text"
              name="addEmail"
              value={addEmail}
              onChange={this.handleChange}
            />
            <button
              className="btn"
              type="submit"
              onClick={this.handleSubmit}
            >
              Add
            </button>
          </form>
        </div>
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

    relay.loadMore(EMAILS_PER_PAGE)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { addEmail } = this.state
    AddEmailMutation(
      addEmail,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }
}

export default createPaginationContainer(ViewerEmailList,
  {
    viewer: graphql`
      fragment ViewerEmailList_viewer on User {
        allEmails: emails(
          first: $count,
          after: $after
        ) @connection(key: "ViewerEmailList_allEmails") {
          edges {
            node {
              ...ViewerEmail_email
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
      query ViewerEmailListForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerEmailList_viewer
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