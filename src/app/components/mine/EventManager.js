'use strict'

import {
  AppSettings,
  Lang,
  Graphics
} from '../../settings'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ListView,
  TouchableOpacity,
  View
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as eventsActions from '../../redux/actions/eventsActions'

import Loading from '../shared/Loading'
import TextView from '../shared/TextView'
import EditLink from '../shared/EditLink'
import {formatEventGroupLabel} from '../../../util/common'
import styles from '../../styles/main'

class EventManager extends Component {
  constructor(props) {
    super(props)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    this.renderRow = this.renderRow.bind(this)
    this.signupList = this.signupList.bind(this)
  }

  eventPage(id) {
    this.props.navigator.push({
      id: 'EventDetail',
      title: Lang.EventDetail,
      passProps: {
        id
      }
    })
  }

  signupList(event, groupIndex) {
    this.props.navigator.push({
      id: 'SignUpList',
      title: Lang.SignUpList,
      passProps: {
        event,
        groupIndex
      }
    })
  }

  componentDidMount() {
    this.props.eventsActions.listEvents("?creator=" + this.props.user._id)
  }

  renderRow(event, sectionId, rowId) {
    return (
      <View style={styles.detail.section}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.eventPage(event._id)}>
            <TextView
              style={{flex: 1, fontWeight: '400', marginBottom: 5, paddingHorizontal: 15}}
              fontSize="XL"
              textColor={Graphics.textColors.link}
              text={event.title}
            />
          </TouchableOpacity>
          <TextView
            style={{flex: 1, marginBottom: 5, paddingHorizontal: 15, textAlign: 'right'}}
            fontSize="XL"
            text={event.total + Lang.Yuan}
          />
        </View>
        <View style={styles.editor.group}>
        {
          event.groups.map((group, index) => {
            const dates = formatEventGroupLabel(event, index)
            return (
              <EditLink
                key={index}
                label={dates}
                value={group.signUps.length} 
                onPress={() => this.signupList(event, index)}
              />
            )
          })
        }
        </View>
      </View>
    )
  }

  render() {
    const {events, navigator} = this.props

    if (!events) {
      return <Loading />
    }

    return (
      <ListView
        enableEmptySections={true}
        scrollEnabled={false}
        dataSource={this.dataSource.cloneWithRows(events)}
        renderRow={this.renderRow}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    events: state.events.list,
    user: state.login.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions: bindActionCreators(eventsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventManager)
