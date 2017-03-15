'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ListView,
  StyleSheet
} from 'react-native'

import Loading from '../shared/Loading'
import UserLink from './UserLink'

export default class UserList extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })

    this.state = {
      loading: true,
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillMount() {
    if (this.props.data) {
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(this.props.data)
      })
    } else {
      this.fetchData()
    }
  }

  fetchData() {
    fetch(this.props.api)
    .then((res) => res.json())
    .then((res) => {
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(res)
      })
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <UserLink user={rowData} navigator={this.props.navigator} key={rowId} />
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    }

    return (
      <ListView
        scrollEnabled={false}
        style={local.list}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    )
  }
}

UserList.propTypes = {
  data: PropTypes.array.isRequired,
  api: PropTypes.string
}

const local = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  }
})