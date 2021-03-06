'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import CameraRollPicker from 'react-native-camera-roll-picker'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as newEventActions from '../../../redux/actions/newEventActions'

import {
  AppSettings,
  Lang,
  Graphics
} from '../../../../common/__'

class EditEventGallery extends Component {
  constructor(props) {
    super(props)
    this.getSelectedImages = this.getSelectedImages.bind(this)

    this.state = {
      imageCount: this.props.photos.length,
      selected: this.props.photos,
    }
  }

  componentWillUnmount() {
    if (this.state.selected.length > 0) {
      this.props.newEventActions.setEventPhotos(this.state.selected)
    }
  }

  getSelectedImages(images, current) {
    this.setState({
      imageCount: images.length,
      selected: images,
    })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.gallery}>
          <CameraRollPicker
            groupTypes={'All'}
            batchSize={20}
            maximum={AppSettings.maxPhotosPerGallery}
            selected={this.state.selected}
            assetType={'Photos'}
            imagesPerRow={4}
            imageMargin={5}
            callback={this.getSelectedImages}
          />
        </View>
        <View style={styles.statusBar}>
          <View style={styles.block}>
            <Text style={styles.indicator}>
              {Lang.PhotosSelectedPrefix}
              <Text style={styles.imageCount}>{this.state.imageCount}</Text>
              {Lang.PhotosSelectedPostfix}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

/*
        <View style={styles.block}>
          <TouchableOpacity onPress={this.previewPhotos}>
            <Text style={styles.button}>{Lang.Preview}</Text>
          </TouchableOpacity>
        </View>
*/

EditEventGallery.propTypes = {
  navigator: PropTypes.object.isRequired,
  newEventActions: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Graphics.colors.background,
    flex: 1,
    flexDirection: 'column',
  },
  gallery: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 64
  },
  statusBar: {
    borderTopColor: Graphics.colors.border,
    borderTopWidth: 1,
    height: 48,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  block: {
    flex: 1,
    justifyContent: 'center'
  },
  indicator: {
    justifyContent: 'center',
    marginBottom: 5,
    textAlign: 'right'
  },
  imageCount: {
    color: Graphics.colors.primary,
    fontSize: Graphics.fontSizes.L
  },
  button: {
    color: Graphics.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
})

function mapStateToProps(state, ownProps) {
  return {
    photos: state.newEvent.photos
  }
}

function mapDispatchToProps(dispatch) {
  return {
    newEventActions: bindActionCreators(newEventActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventGallery)
