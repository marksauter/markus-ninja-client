import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link, withRouter } from 'react-router-dom';
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateTopicsMutation from 'mutations/UpdateTopicsMutation'
import { get, isEmpty } from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

class CourseMetaTopics extends React.Component {
  constructor(props) {
    super(props)

    const topicEdges = get(props, "course.topics.edges", [])
    const topics = topicEdges.map(edge => get(edge, "node.name")).join(" ")

    this.state = {
      error: null,
      invalidTopicNames: null,
      topics: {
        ...defaultTextFieldState,
        initialValue: topics,
        value: topics,
      },
      open: false,
    }
  }

  handleCancel = () => {
    this.setState({open: false})
    this.props.onClose()
    this.reset_()
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
      error: null,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { topics } = this.state
    UpdateTopicsMutation(
      this.props.course.id,
      topics.value.split(" "),
      (error, invalidTopicNames) => {
        if (!isEmpty(invalidTopicNames)) {
          this.setState({ error, invalidTopicNames })
        } else {
          this.handleToggleOpen()
          this.setState({
            error: null,
            topics: {
              ...this.state.topics,
              initialValue: topics.value,
            },
            invalidTopicNames: null,
          })
        }
      },
    )
  }

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open, error: null })
    this.props.onOpen(open)
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

    relay.loadMore(TOPICS_PER_PAGE)
  }

  reset_ = () => {
    this.setState({
      error: null,
      invalidTopicNames: null,
      topics: {
        ...this.state.topics,
        value: this.state.topics.initialValue,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && course.viewerCanAdmin
        ? this.renderForm()
        : this.renderTopics()}
      </div>
    )
  }

  renderForm() {
    const {topics} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          fullWidth
          label="Topics (separate with spaces)"
          helperText={this.renderHelperText()}
          inputProps={{
            name: "topics",
            value: topics.value,
            placeholder: "Topics (separate with spaces)",
            pattern: "^([a-zA-Z0-9-]{1,39}\\s+)*([a-zA-Z0-9-]{1,39})$",
            onChange: this.handleChange,
          }}
        />
        <div className="inline-flex items-center mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Save
          </button>
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  renderHelperText() {
    const {topics} = this.state

    return (
      <HelperText persistent validation={!topics.valid}>
        {topics.valid
        ? "Add topics to categorize your study and make it more discoverable."
        : "Topic names must be less than 40 characters, and may only contain alphanumeric characters or hyphens. Separate with spaces."}
      </HelperText>
    )
  }

  renderTopics() {
    const course = get(this.props, "course", {})
    const topicEdges = get(course, "topics.edges", [])
    const pageInfo = get(course, "topics.pageInfo", {})

    return (
      <div className="flex flex-wrap items-center w-100">
        {topicEdges.map(({node}) => node
        ? <Link
            className="mdc-button mdc-button--outlined mr1 mb1"
            key={node.id}
            to={node.resourcePath}
          >
            {node.name}
          </Link>
        : null)}
        {pageInfo.hasNextPage &&
        <button
          className="material-icons mdc-icon-button mr1 mb1"
          onClick={this._loadMore}
        >
          Load more
        </button>}
        {course.viewerCanAdmin &&
        <button
          className="mdc-button mdc-button--unelevated mr1 mb1"
          type="button"
          onClick={this.handleToggleOpen}
        >
          Manage topics
        </button>}
      </div>
    )
  }
}

CourseMetaTopics.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

CourseMetaTopics.defaulProps = {
  onClose: () => {},
  onOpen: () => {},
}

export default withRouter(createPaginationContainer(CourseMetaTopics,
  {
    course: graphql`
      fragment CourseMetaTopics_course on Course @argumentDefinitions(
        after: {type: "String"},
        count: {type: "Int!"},
      ) {
        id
        topics(first: $count, after: $after)
        @connection(key: "CourseMetaTopics_topics", filters: []) {
          edges {
            node {
              id
              name
              resourcePath
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        viewerCanAdmin
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query CourseMetaTopicsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String,
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseMetaTopics_course @arguments(
              after: $after,
              count: $count,
            )
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "course.topics")
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
        number: props.match.params.number,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))
