'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as postsActions from '../../../redux/actions/postsActions'

import Card from '../shared/Card'
import Loading from '../shared/Loading'
import ImagePath from '../shared/ImagePath'
import ParallaxView from 'react-native-parallax-view'
import Toolbar from '../shared/Toolbar'
import UserLink from '../user/UserLink'
import WebViewWrapper from '../shared/WebViewWrapper'
import CommentPreview from '../shared/CommentPreview'

import styles from '../../styles/main'

import {
  CONSTANTS,
  AppSettings,
  Graphics
} from '../../../../common/__'

class PostDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.postsActions.getPost(this.props.id)
  }

  render() {
    const {post, navigator} = this.props

    if (!post) {
      return <Loading />
    }

    let commentsPreview = (post.comments.length > 0) ? (
      <CommentPreview 
        navigator={navigator}
        type={CONSTANTS.ACTION_TARGETS.POST}
        data={post}
        user={this.props.user}
      />
    ) : null

    const url = ImagePath({type: 'hero', path: CONSTANTS.ASSET_FOLDERS.POST + '/' + post._id + '/' + post.hero})

    return (
      <View style={styles.global.wrapper}>
        <ParallaxView
          style={{flex: 1}}
          backgroundSource={{uri: url}}
          windowHeight={Graphics.heroImage.height}
          header={(
            <Card
              align={'bottom'}
              title={post.title}
              tags={post.tags}
            />
          )}>
          <View style={styles.detail.article}>
            <View style={[styles.detail.section, {paddingHorizontal: 15}]}>
              <UserLink
                navigator={navigator}
                user={post.creator}
              />
            </View>
            <View style={[styles.detail.section, {paddingHorizontal: 10}]}>
              <WebViewWrapper
                html={post.content}
                uri={AppSettings.baseUri + 'posts/' + post._id}
              />
            </View>
            {commentsPreview}
          </View>
        </ParallaxView>
        <View style={styles.detail.toolbar}>
          <Toolbar
            navigator={navigator}
            type={CONSTANTS.ACTION_TARGETS.POST}
            data={post}
          />
        </View>
      </View>
    )
  }
}

PostDetail.propTypes = {
  navigator: PropTypes.object.isRequired,
  postsActions: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  post: PropTypes.object,
  user: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    post: state.posts.post,
    user: state.login.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    postsActions: bindActionCreators(postsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail)
