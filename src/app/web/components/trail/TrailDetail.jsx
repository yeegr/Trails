'user strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  Link
} from 'react-router'

import $ from 'jquery'

import {connect} from 'react-redux'

import TrailInfo from './TrailInfo'
import TrailData from './TrailData'
import TrailMap from './TrailMap'
import TrailChart from './TrailChart'
import UserLink from '../user/UserLink'
import Header from '../shared/Header'
import GalleryPreview from '../shared/GalleryPreview'
import CommentPreview from '../shared/CommentPreview'

import {
  LANG,
  UTIL,
  AppSettings
} from '../../../../common/__'

class TrailDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    $.get(AppSettings.apiUri + 'trails/' + this.props.routeParams.id, (trail) => {
      this.setState({
        trail,
        loading: false
      })
    })
  }

  render() {
    if (this.state.loading === true) {
      return (
        <detail data-loading />
      )
    }

    const {trail} = this.state,
      galleryPreview = (trail.photos.length > 0) ? (
        <GalleryPreview
          title={LANG.t('trail.Photos')}
          type={'trails'}
          id={trail._id}
          photos={trail.photos}
        />
      ) : null,
      commentPreview = (trail.comments.length > -1) ? (
        <CommentPreview
          type={'trails'}
          id={trail._id}
          comments={trail.comments}
        />
      ) : null

    return (
      <detail>
        <scroll>
          <main>
            <section>
              <content>
                <TrailInfo 
                  type={trail.type}
                  title={trail.title}
                  date={trail.date}
                />
              </content>
            </section>
            <section>
              <content>
                <TrailData
                  difficultyLevel={trail.difficultyLevel}
                  totalDuration={trail.totalDuration}
                  totalDistance={trail.totalDistance}
                  totalElevation={trail.totalElevation}
                  maximumAltitude={trail.maximumAltitude}
                  averageSpeed={trail.averageSpeed}
                />
              </content>
            </section>
            <section>
              <TrailMap
                id={trail._id}
                points={trail.points}
              />
            </section>
            <section>
              <content>
                <TrailChart
                  points={trail.points}
                />
              </content>
            </section>
            <section>
              <content>
                <UserLink
                  title={LANG.t('trail.Creator')}
                  user={trail.creator}
                />
              </content>
            </section>
            <section>
              <Header text={LANG.t('trail.TrailDescription')} />
              <content>
                <div
                  className="html-content"
                  dangerouslySetInnerHTML={UTIL.createMarkup(trail.description)}
                />
              </content>
            </section>
            {galleryPreview}
            {commentPreview}
          </main>
        </scroll>
      </detail>
    )
  }
}

TrailDetail.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(TrailDetail)
