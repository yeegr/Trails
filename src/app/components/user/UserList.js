'use strict'

import {
  AppSettings,
  Lang,
  Graphics
} from '../../settings'

import React, {
  Component
} from 'react'

import {
  ListView,
  TouchableHighlight, TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet} from 'react-native'

import styles from '../../styles/main'
import Loading from '../shared/Loading'
import UserLink from './UserLink'

export default class UserList extends Component {
  constructor(props) {
    super(props)

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })

    this.state = {
      loading: true,
      dataSource: ds.cloneWithRows([])
    }
  }

  fetchData() {
    fetch(this.props.api)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(responseData)
      })
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(this.props.data)
      })
    } else {
      this.fetchData()
    }
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

const local = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  }
})
