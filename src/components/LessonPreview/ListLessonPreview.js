import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import EnrollIconButton from 'components/EnrollIconButton'
import Icon from 'components/Icon'
import LabelLink from 'components/LabelLink'
import RemoveCourseLessonMutation from 'mutations/RemoveCourseLessonMutation'
import {get} from 'utils'

class ListLessonPreview extends React.Component {
  handleRemoveFromCourse = () => {
    if (get(this.props, "lesson.course.viewerCanAdmin", false)) {
      RemoveCourseLessonMutation(
        get(this.props, "lesson.course.id", ""),
        get(this.props, "lesson.id", ""),
        (response, errors) => {
          if (errors) {
            console.error(errors[0].message)
          }
        },
      )
    }
  }

  get classes() {
    const {className, drag, edit} = this.props
    return cls("ListLessonPreview mdc-list-item", className, {
      "ListLessonPreview--editting": edit,
      "ListLessonPreview--dragging": drag,
    })
  }

  get number() {
    const {isCourse, lesson} = this.props
    return isCourse ? lesson.courseNumber : lesson.number
  }

  get otherProps() {
    const {
      children,
      className,
      edit,
      innerRef,
      isCourse,
      lesson,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {edit, innerRef, isCourse, lesson} = this.props
    const labelNodes = get(lesson, "labels.nodes", [])

    if (!lesson) {
      return null
    }

    return (
      <li
        {...this.otherProps}
        ref={innerRef}
        className={this.classes}
      >
        <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={lesson.resourcePath}>
            {lesson.title}
            <span className="mdc-theme--text-secondary-on-light ml1">#{this.number}</span>
          </Link>
          <span className="mdc-list-item__secondary-text">
            Created on
            <span className="mh1">{moment(lesson.createdAt).format("MMM D")}</span>
            by
            <Link
              className="rn-link rn-link--secondary ml1"
              to={get(lesson, "author.resourcePath", "")}
            >
              {get(lesson, "author.login")}
            </Link>
          </span>
        </span>
        <span className="mdc-list-item__tags">
          {labelNodes.map((node) =>
            node &&
            <LabelLink key={node.id} label={node} />
          )}
        </span>
        {isCourse && edit && get(lesson, "course.viewerCanAdmin", false)
        ? this.renderEditMeta()
        : this.renderMeta()}
      </li>
    )
  }

  renderEditMeta() {
    return (
      <span className="mdc-list-item__meta">
        <div className="mdc-list-item__meta-actions">
          <button
            className="material-icons mdc-icon-button"
            type="button"
            onClick={this.handleRemoveFromCourse}
            aria-label="Remove lesson"
            title="Remove lesson"
          >
            remove
          </button>
        </div>
      </span>
    )
  }

  renderMeta() {
    const {lesson} = this.props

    return (
      <span className="mdc-list-item__meta">
        <div className="mdc-list-item__meta-actions">
          {lesson.viewerCanEnroll &&
          <EnrollIconButton enrollable={get(this.props, "lesson", null)} />}
          <Link
            className="rn-icon-link"
            to={lesson.resourcePath}
          >
            <Icon className="rn-icon-link__icon" icon="comment" />
            {get(lesson, "comments.totalCount", 0)}
          </Link>
        </div>
      </span>
    )
  }
}

ListLessonPreview.propTypes = {
  edit: PropTypes.bool,
  isCourse: PropTypes.bool,
}

ListLessonPreview.defaultProps = {
  edit: false,
  isCourse: false,
}

export default ListLessonPreview
