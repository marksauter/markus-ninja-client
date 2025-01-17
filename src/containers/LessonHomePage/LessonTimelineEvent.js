import * as React from 'react'
import { get } from 'utils'
import AddedToCourseEvent from 'components/AddedToCourseEvent'
import LabeledEvent from 'components/LabeledEvent'
import Comment from 'components/Comment'
import PublishedEvent from 'components/PublishedEvent'
import ReferencedEvent from 'components/ReferencedEvent'
import RemovedFromCourseEvent from 'components/RemovedFromCourseEvent'
import RenamedEvent from 'components/RenamedEvent'
import UnlabeledEvent from 'components/UnlabeledEvent'

class LessonTimelineEvent extends React.PureComponent {
  render() {
    const {className} = this.props
    const item = get(this.props, "item", null)

    switch(item.__typename) {
      case "AddedToCourseEvent":
        return <AddedToCourseEvent className={className} event={item} />
      case "Comment":
        return <Comment className={className} comment={item} />
      case "LabeledEvent":
        return <LabeledEvent className={className} event={item} />
      case "PublishedEvent":
        return <PublishedEvent className={className} event={item} />
      case "ReferencedEvent":
        return <ReferencedEvent className={className} event={item} />
      case "RemovedFromCourseEvent":
        return <RemovedFromCourseEvent className={className} event={item} />
      case "RenamedEvent":
        return <RenamedEvent className={className} event={item} />
      case "UnlabeledEvent":
        return <UnlabeledEvent className={className} event={item} />
      default:
        return null
    }
  }
}

export default LessonTimelineEvent
