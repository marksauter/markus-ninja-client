import * as React from 'react'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'
import pluralize from 'pluralize'
import TextField, {Input} from '@material/react-text-field'
import Icon from 'components/Icon'
import {SearchProp, SearchPropDefaults} from 'components/Search'
import SearchNav from './SearchNav'
import SearchResults from 'components/SearchResults'
import {debounce, get, isEmpty} from 'utils'

class SearchPageResults extends React.Component {
  constructor(props) {
    super(props)

    const searchQuery = queryString.parse(get(this.props, "location.search", ""))
    const q = get(searchQuery, "q", "")

    this.state = {
      open: false,
      q,
    }
  }

  handleChange = (e) => {
    this.setState({q: e.target.value})
    this._redirect()
  }

  _redirect = debounce(() => {
    const {location, history} = this.props
    const {q} = this.state

    const searchQuery = queryString.parse(get(location, "search", ""))
    searchQuery.q = isEmpty(q) ? undefined : q

    const search = queryString.stringify(searchQuery)

    history.replace({pathname: location.pathname, search})
  }, 100)

  get type() {
    const {type} = this.props.search
    if (type === "USER_ASSET") return "Assets";
    const pluralType = pluralize(type.toLowerCase())
    return pluralType.charAt(0).toUpperCase() + pluralType.slice(1)
  }

  render() {
    const {open} = this.state
    const {search} = this.props

    return (
      <React.Fragment>
        <SearchNav open={open} counts={search.counts} onClose={() => this.setState({open: false})}/>
        <div className="rn-page mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <div className="flex items-start">
                <h4>
                  <Icon className="mr2" icon={search.type} />
                  {this.type}
                </h4>
                <button
                  type="button"
                  className="mdc-button ml2 mt1"
                  onClick={() => this.setState({open: !open})}
                >
                  Change type
                </button>
              </div>
            </div>
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              {this.renderInput()}
            </div>
            <SearchResults search={search} />
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderInput() {
    const {q} = this.state

    return (
      <TextField
        fullWidth
        label="Search..."
        trailingIcon={<i className="material-icons">search</i>}
      >
        <Input
          name="q"
          autoComplete="off"
          placeholder="Search..."
          value={q}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

SearchPageResults.propTypes = {
  search: SearchProp,
}

SearchPageResults.defaultProps = {
  search: SearchPropDefaults,
}

export default withRouter(SearchPageResults)
