import * as React from 'react'
import {UserStudiesProp, UserStudiesPropDefaults} from 'components/UserStudies'
import StudyPreview from 'components/StudyPreview'
import {isEmpty} from 'utils'

class UserStudiesTabStudies extends React.Component {
  render() {
    const {studies} = this.props
    const {edges, hasMore, isLoading, loadMore} = studies

    const noResults = isEmpty(edges)

    return (
      <React.Fragment>
        {isLoading && noResults
        ? <div>Loading...</div>
        : (noResults
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No studies were found.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <ul className="mdc-list mdc-list--two-line">
                {edges.map(({node}) => (
                  node &&
                  <StudyPreview.User key={node.id} study={node} />
                ))}
              </ul>
              {hasMore &&
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                <button
                  className="mdc-button mdc-button--unelevated"
                  type="button"
                  onClick={loadMore}
                >
                  More
                </button>
              </div>}
            </div>)}
      </React.Fragment>
    )
  }
}

UserStudiesTabStudies.propTypes = {
  studies: UserStudiesProp,
}

UserStudiesTabStudies.defaultProps = {
  studies: UserStudiesPropDefaults,
}

export default UserStudiesTabStudies