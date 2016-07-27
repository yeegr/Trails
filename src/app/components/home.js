'use strict'

import {
  AppSettings,
  Lang,
  Graphics
} from '../settings'

import React, {
  Component
} from 'react'

import {
  ScrollView,
  TabBarIOS,
  View,
  StyleSheet
} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as homeActions from '../containers/actions/homeActions'
import {changeTab} from '../containers/actions/homeActions'
import {showLogin} from '../containers/actions/loginActions'
import {HOME_TABS} from '../../constants'

import AreaList from './area/AreaList'
import EventList from './event/EventList'
import PostList from './post/PostList'
import UserInfo from './mine/UserInfo'
import styles from '../styles/main'

class Home extends Component {
  constructor(props) {
    super(props)
    this.onTabPressed = this.onTabPressed.bind(this)
  }

  onTabPressed(tabId) {
    if (tabId === HOME_TABS.MINE && this.props.user === null) {
       this.props.showLogin()
       return false
    }

    this.props.changeTab(tabId)
  }

  render() {
    const {selectedTab, navigator} = this.props

    return (
      <View style={styles.global.wrapper}>
        <TabBarIOS
          tintColor={AppSettings.color.primary}
        >
          <TabBarIOS.Item
            title={Lang.Trails}
            icon={{uri: Graphics.icon.trail, scale: 3}}
            selected={selectedTab === HOME_TABS.AREAS}
            onPress={() => this.onTabPressed(HOME_TABS.AREAS)}
          >
            <ScrollView style={styles.global.main}>
              <AreaList navigator={navigator} params="" />
            </ScrollView>
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title={Lang.Events}
            icon={{uri: Graphics.icon.event, scale: 3}}
            selected={selectedTab === HOME_TABS.EVENTS}
            onPress={() => this.onTabPressed(HOME_TABS.EVENTS)}
          >
            <ScrollView style={styles.global.main}>
              <EventList navigator={navigator} params="" />
            </ScrollView>
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title={Lang.Posts}
            icon={{uri: Graphics.icon.post, scale: 3}}
            selected={selectedTab === HOME_TABS.POSTS}
            onPress={() => this.onTabPressed(HOME_TABS.POSTS)}
          >
            <ScrollView style={styles.global.main}>
              <PostList navigator={navigator} params="" />
            </ScrollView>
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title={Lang.Mine}
            icon={{uri: Graphics.icon.mine, scale: 3}}
            selected={selectedTab === HOME_TABS.MINE}
            onPress={() => this.onTabPressed(HOME_TABS.MINE)}
          >
            <UserInfo navigator={navigator} />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    selectedTab: state.home.selectedTab,
    user: state.login.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeTab: (tabId) => dispatch(changeTab(tabId)),
    showLogin: () => dispatch(showLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)