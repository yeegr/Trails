'use strict'

import React, {
  PropTypes
} from 'react'

import {
  LANG,
  UTIL
} from '../../../../common/__'

const TrailInfo = (props) => {
  const title = (props.title.length < 1) ? LANG.t('trail.edit.Unnamed') : props.title

  return (
    <row>
      <pictogram
        shape="circle"
        data-value={props.type}
      />
      <info>
        <title>{title}</title>
        <subtitle>
          {UTIL.formatTime(props.date)}
        </subtitle>
      </info>
    </row>
  )
}

TrailInfo.propTypes = {
  type: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired
}

export default TrailInfo