'use strict'

import React, {
  PropTypes
} from 'react'

import {
  Graphics
} from '../../settings'

import TextView from './TextView'

const TagList = (props) => {
  if (props.tags.length < 1) {
    return null
  }

  let txt = '# ',
    textColor = props.textColor || Graphics.textColors.overlay

  props.tags.map((tag) => {
    txt += tag + ' '
  })

  return <TextView textColor={textColor} text={txt} />
}

TagList.propTypes = {
  tags: PropTypes.array,
  textColor: PropTypes.string
}

export default TagList