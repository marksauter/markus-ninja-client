import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import RichTextEditor from 'components/RichTextEditor'
import { get, isNil } from 'utils'

class AddLessonCommentForm extends React.Component {
  state = {
    error: null,
    body: "",
    submitted: false,
  }

  componentDidUpdate() {
    if (this.state.submitted) {
      this.setState({ submitted: false })
    }
  }

  handleChangeBody = (body) => {
    this.setState({body})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body } = this.state
    AddLessonCommentMutation(
      this.props.lesson.id,
      body,
      (response, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.setState({ submitted: true })
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("AddLessonCommentForm mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {submitted} = this.state

    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <RichTextEditor
          id="AddLessonCommentForm__body"
          onChange={this.handleChangeBody}
          submit={submitted}
          placeholder="Leave a comment"
          study={get(this.props, "lesson.study", null)}
        />
        <button className="mdc-button mdc-button--unelevated mt2" type="submit">Comment</button>
      </form>
    )
  }
}

export default withRouter(createFragmentContainer(AddLessonCommentForm, graphql`
  fragment AddLessonCommentForm_lesson on Lesson {
    id
    study {
      ...RichTextEditor_study
    }
  }
`))