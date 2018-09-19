import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import UpdateTopicMutation from 'mutations/UpdateTopicMutation'
import {get, isEmpty, isNil} from 'utils'

class TopicHeader extends React.Component {
  state = {
    error: null,
    open: false,
    description: get(this.props, "topic.description", ""),
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state
    UpdateTopicMutation(
      this.props.topic.id,
      description,
      (updatedTopic, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          description: get(updatedTopic, "description", ""),
        })
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const topic = get(this.props, "topic", {})
    const {open} = this.state

    return (
      <React.Fragment>
        <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell-span-12">
          {topic.name}
        </h4>
        {open && topic.viewerCanUpdate
        ? this.renderForm()
        : this.renderDetails()}
      </React.Fragment>
    )
  }

  renderForm() {
    const {description} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <div className="inline-flex items-center w-100">
          <TextField
            className="flex-auto"
            outlined
            label="Description"
            floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
          >
            <Input
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </TextField>
          <button
            className="mdc-button mdc-button--unelevated ml2"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <span
            className="pointer pa2"
            role="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </span>
        </div>
      </form>
      )
    }

  renderDetails() {
    const topic = get(this.props, "topic", {})

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="inline-flex w-100">
          <div className="mdc-theme--subtitle1 flex-auto mdc-theme--text-secondary-on-light">
            {topic.description || "No description provided"}
          </div>
          {topic.viewerCanUpdate &&
          <button
            className="material-icons mdc-icon-button"
            type="button"
            onClick={this.handleToggleOpen}
          >
            edit
          </button>}
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(TopicHeader, graphql`
  fragment TopicHeader_topic on Topic {
    description
    name
    viewerCanUpdate
  }
`))
