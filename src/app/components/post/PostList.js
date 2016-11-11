'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ListView,
  RefreshControl
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as postsActions from '../../redux/actions/postsActions'

import Loading from '../shared/Loading'
import PostCard from './PostCard'

class PostList extends Component {
  constructor(props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
  }

  componentWillMount() {
    this.fetchData()
  }

  fetchData() {
    this.props.postsActions.listPosts(this.props.query)
  }

  onRefresh() {
    this.fetchData()
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <PostCard
        key={rowId}
        navigator={this.props.navigator}
        data={rowData}
      />
    )
  }

  render() {
    const {posts} = this.props

    if (!posts.list) {
      return <Loading />
    }

    return (
      <ListView
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            refreshing={posts.isFetching}
            onRefresh={() => this.onRefresh()}
          />
        }
        removeClippedSubviews={false}
        scrollEnabled={true}
        dataSource={this.dataSource.cloneWithRows(posts.list)}
        renderRow={this.renderRow}
      />
    )
  }
}

PostList.propTypes = {
  navigator: PropTypes.object.isRequired,
  postsActions: PropTypes.object.isRequired,
  query: PropTypes.string,
  posts: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    posts: state.posts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    postsActions: bindActionCreators(postsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)
