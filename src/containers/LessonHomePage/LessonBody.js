import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import moment from 'moment'
import graphql from 'babel-plugin-relay/macro'
import shortid from 'shortid'
import Dialog from 'components/Dialog'
import Snackbar from 'components/mdc/Snackbar'
import StudyBodyEditor from 'components/StudyBodyEditor'
import LessonDraftBackup from 'components/LessonDraftBackup'
import LessonDraftBackups from 'components/LessonDraftBackups'
import PublishLessonDraftMutation from 'mutations/PublishLessonDraftMutation'
import ResetLessonDraftMutation from 'mutations/ResetLessonDraftMutation'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import {debounce, get, isNil, timeDifferenceForDate} from 'utils'

class LessonBody extends React.Component {
  editorElement_ = React.createRef()
  state = {
    confirmPublishDialogOpen: false,
    edit: !get(this.props, "lesson.isPublished", false),
    error: null,
    draft: {
      dirty: false,
      initialValue: get(this.props, "lesson.draft", ""),
      value: get(this.props, "lesson.draft", ""),
    },
    draftBackup: "",
    draftBackupId: "",
    formId: "",
    restoreDraftFromBackupDialogOpen: false,
    showSnackbar: false,
    snackbarMessage: "",
  }

  componentDidMount() {
    this.setState({
      formId: `restore-lesson-draft-from-backup${shortid.generate()}`,
    })
  }

  updateDraft = debounce((draft) => {
    UpdateLessonMutation(
      this.props.lesson.id,
      null,
      draft,
      (lesson, errors) => {
        if (!isNil(errors)) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Failed to save draft",
          })
          return
        } else if (lesson) {
          this.setState({
            draft: {
              ...this.state.draft,
              dirty: false,
              value: lesson.draft,
            },
          })
        }
      },
    )
  }, 1000)

  handleChange = (value) => {
    this.setState({
      draft: {
        dirty: true,
        value,
      },
    })
    this.updateDraft(value)
  }

  handlePreview = () => {
    const {draft} = this.state
    if (draft.dirty) {
      this.updateDraft(draft.value)
    }
  }

  handlePublish = () => {
    PublishLessonDraftMutation(
      this.props.lesson.id,
      (lesson, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Failed to publish lesson",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Lesson published",
        })
        this.handleToggleEdit()
      },
    )
  }

  handleReset = () => {
    ResetLessonDraftMutation(
      this.props.lesson.id,
      (lesson, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        if (lesson) {
          this.setState({
            draft: {
              ...this.state.draft,
              dirty: false,
              value: lesson.draft
            },
          })
          const editor = this.editorElement_ && this.editorElement_.current
          editor.setText(lesson.draft)
        }
      },
    )
  }

  handleRestore = (e) => {
    e.preventDefault()
    const editor = this.editorElement_ && this.editorElement_.current
    editor && editor.changeText(this.state.draftBackup)
    this.setState({
      draftBackup: "",
      draftBackupId: "",
    })
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  handleTogglePublishConfirmation = () => {
    const {confirmPublishDialogOpen} = this.state
    this.setState({
      confirmPublishDialogOpen: !confirmPublishDialogOpen,
    })
  }

  handleToggleRestoreDraftFromBackup = () => {
    const {restoreDraftFromBackupDialogOpen} = this.state
    this.setState({
      restoreDraftFromBackupDialogOpen: !restoreDraftFromBackupDialogOpen,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("LessonBody mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get isPublishable() {
    const lesson = get(this.props, "lesson", {})
    const {draft} = this.state

    return !draft.dirty && moment(lesson.lastEditedAt).isAfter(lesson.publishedAt)
  }

  render() {
    const {lesson} = this.props
    const {edit, showSnackbar, snackbarMessage} = this.state
    const study = get(this.props, "lesson.study", null)

    return (
      <div className={this.classes}>
        <div className="center mw7">
          <StudyBodyEditor study={study}>
            <StudyBodyEditor.Main
              ref={this.editorElement_}
              bodyClassName="min-vh-25"
              bodyHeaderText={`Updated ${timeDifferenceForDate(get(lesson, "publishedAt"))}`}
              bottomActions={lesson.viewerCanUpdate && edit &&
                <div className="mdc-card__actions rn-card__actions">
                  <div className="mdc-card__action-buttons">
                    <button
                      type="button"
                      className="mdc-button mdc-card__action mdc-card__action--button"
                      onClick={this.handleTogglePublishConfirmation}
                      disabled={!this.isPublishable}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              }
              edit={edit}
              isPublishable={this.isPublishable}
              handleChange={this.handleChange}
              handlePreview={this.handlePreview}
              handlePublish={this.handleTogglePublishConfirmation}
              handleReset={this.handleReset}
              handleRestore={this.handleToggleRestoreDraftFromBackup}
              handleToggleEdit={this.handleToggleEdit}
              object={lesson}
              placeholder="Begin your lesson"
              study={study}
            />
          </StudyBodyEditor>
        </div>
        {lesson.viewerCanUpdate && this.renderConfirmPublishDialog()}
        {lesson.viewerCanUpdate && this.renderRestoreDraftFromBackupDialog()}
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
      </div>
    )
  }

  renderConfirmPublishDialog() {
    const {confirmPublishDialogOpen} = this.state

    return (
      <Dialog
        open={confirmPublishDialogOpen}
        onClose={() => this.setState({confirmPublishDialogOpen: false})}
        title={<Dialog.Title>Publish lesson</Dialog.Title>}
        content={
          <Dialog.Content>
            <div className="flex flex-column mw5">
              <p>Are you sure?</p>
            </div>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="no"
            >
              No
            </button>
            <button
              type="button"
              className="mdc-button"
              onClick={this.handlePublish}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }

  renderRestoreDraftFromBackupDialog() {
    const lessonId = get(this.props, "lesson.id")
    const {draftBackupId, formId, restoreDraftFromBackupDialogOpen} = this.state

    return (
      <Dialog
        open={restoreDraftFromBackupDialogOpen}
        onClose={() => this.setState({restoreDraftFromBackupDialogOpen: false})}
        title={
          <Dialog.Title>
            <div>
              Restore draft from backup
            </div>
            {restoreDraftFromBackupDialogOpen &&
            <LessonDraftBackups
              className="mt2"
              lessonId={lessonId}
              value={draftBackupId}
              onChange={(draftBackupId) => this.setState({draftBackupId})}
            />}
          </Dialog.Title>
        }
        content={
          <Dialog.Content>
            <form id={formId} onSubmit={this.handleRestore}>
              <LessonDraftBackup
                lessonId={lessonId}
                backupId={draftBackupId}
                onChange={(draftBackup) => this.setState({draftBackup})}
              />
            </form>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              className="mdc-button"
              data-mdc-dialog-action="restore"
            >
              Restore
            </button>
          </Dialog.Actions>}
        />
    )
  }
}

export default createFragmentContainer(LessonBody, graphql`
  fragment LessonBody_lesson on Lesson {
    id
    bodyHTML
    draft
    isPublished
    lastEditedAt
    publishedAt
    study {
      ...StudyBodyEditor_study
    }
    viewerCanUpdate
  }
`)
