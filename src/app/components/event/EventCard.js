'use strict'

import React, {
  PropTypes
} from 'react'

import {
  View
} from 'react-native'

import Hero from '../shared/Hero'
import Card from '../shared/Card'
import TinyStatus from '../shared/TinyStatus'
import TextView from '../shared/TextView'
import TinyUser from '../user/TinyUser'

import global from '../../styles/global'

import {
  LANG,
  UTIL,
  Graphics
} from '../../settings'

const EventCard = (props) => {
  const data = props.data,
    perHead = data.expenses.perHead,
    onPress = () => {
      props.navigator.push({
        id: 'EventDetail',
        title: LANG.t('event.EventDetail'),
        passProps: {
          id: props.data.id
        }
      })
    }

  return (
    <View>
      <Hero
        imageUri={UTIL.getEventHeroPath(data)} 
        onPress={onPress}
        card={
          <Card
            title={data.title}
            excerpt={data.excerpt}
            tags={data.tags}
            topLeft={
              <View style={global.corner}>
                <TinyUser user={data.creator} />
              </View>
            } 
            topRight={
              <View style={global.corner}>
                <TinyStatus data={data} />
              </View>
            } 
            bottomRight={
              <View style={global.corner}>
                <TextView
                  fontSize={'XL'}
                  textColor={Graphics.textColors.overlay}
                  text={(perHead > 0) ? LANG.t('event.PerHead') + LANG.l('currency', perHead) : LANG.t('event.ExpenseFree')}
                />
              </View>
            }
          />
        }
      />
    </View>
  )
}

EventCard.propTypes = {
  navigator: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default EventCard