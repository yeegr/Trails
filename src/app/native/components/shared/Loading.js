'use strict'

import React, {
  PropTypes
} from 'react'

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'

const Loading = (props) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: 50
    }
  })

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={props.size || 'large'}
        animating={true}
      />
    </View>
  )
}

Loading.propTypes = {
  size: PropTypes.string
}

export default Loading