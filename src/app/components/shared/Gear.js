'use strict'

import React, {
  PropTypes
} from 'react'

import {
  Image,
  StyleSheet,
  View,
} from 'react-native'

import ImagePath from './ImagePath'
import TextView from './TextView'

import {
  LANG,
  Graphics
} from '../../settings'

const Gear = (props) => {
  const uri = ImagePath({type: 'gear', path: 'gears/' + props.number + '.jpg'}),
    size = props.sideLength ? {width: props.sideLength, height: props.sideLength} : null,
    marginRight = props.marginRight

  return (
    <Image style={[styles.wrapper, size, {marginRight}]} source={{uri}}>
      <View style={styles.caption}>
        <TextView
          fontSize={'XXS'}
          textColor={Graphics.textColors.overlay}
          text={LANG.t('gears.' + props.number)}
        />
      </View>
    </Image>
  )
},
styles = StyleSheet.create({
  wrapper: {
    borderRadius: 4,
    flexDirection: 'column',
    height: Graphics.gear.sideLength,
    justifyContent: 'flex-end',
    marginBottom: 10,
    overflow: 'hidden',
    width: Graphics.gear.sideLength,
  },
  caption: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  }
})

Gear.propTypes = {
  number: PropTypes.number.isRequired,
  sideLength: PropTypes.number,
  marginRight: PropTypes.number
}

export default Gear