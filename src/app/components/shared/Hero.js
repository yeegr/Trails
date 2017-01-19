'use strict'

import React, {
  PropTypes
} from 'react'

import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import ImagePath from '../shared/ImagePath'
import Card from '../shared/Card'

import {
  Graphics
} from '../../settings'

const Hero = (props) => {
  const uri = ImagePath({type: 'hero', path: props.imageUri})

  let view = (
      <View style={styles.wrapper}>
        <Image 
          source={{uri}}
          style={styles.image}
        />
        {props.card}
      </View>
    ),
    wrapper = (props.onPress) ? (<TouchableOpacity onPress={props.onPress}>{view}</TouchableOpacity>) : view

  return wrapper
},
styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Graphics.heroImage.backgroundColor,
    flex: 1,
    height: Graphics.heroImage.height
  },
  image: {
    bottom: 0,
    left: 0,
    opacity: Graphics.heroImage.opacity,
    resizeMode: 'cover',
    right: 0,
    position: 'absolute',
    top: 0
  }
})

Hero.propTypes = {
  imageUri: PropTypes.string.isRequired,
  card: PropTypes.object,
  onPress: PropTypes.func
}

export default Hero