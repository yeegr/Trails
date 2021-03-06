'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as areasActions from '../../../redux/actions/areasActions'

import AreaCard from './AreaCard'

class AreaList extends Component {
  constructor(props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
  }

  componentWillMount() {
    this.fetchData()
  }

  componentWillUnmount() {
    areasActions.resetAreaList()
  }

  fetchData() {
    this.props.areasActions.listAreas(this.props.query)
  }

  _onRefresh() {
    this.fetchData()
  }

  render() {
    const {areas} = this.props,
      loading = (areas.length < 1)

    return (
      <catalog data-loading={loading}>
        {
          areas.map((area, index) => {
            return (
              <AreaCard
                key={index}
                data={area}
              />
            )
          })
        }
      </catalog>
    )
  }
}

AreaList.propTypes = {
  areasActions: PropTypes.object.isRequired,
  query: PropTypes.string,
  areas: PropTypes.array
}

function mapStateToProps(state, ownProps) {
  return {
    areas: state.areas.list
  }
}

function mapDispatchToProps(dispatch) {
  return {
    areasActions: bindActionCreators(areasActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaList)
