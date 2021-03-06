'use strict'

import React, {
  PropTypes
} from 'react'

import {
  Image,
  ListView,
  TouchableOpacity,
  View
} from 'react-native'

import ImagePath from '../shared/ImagePath'
import InfoItem from '../shared/InfoItem'
import TextView from '../shared/TextView'

import styles from '../../styles/main'

import {
  LANG,
  UTIL,
  AppSettings,
  Graphics
} from '../../../../common/__'

const OrderList = (props) => {
  const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 != r2
  }),

  selectOrder = (order) => {
    props.navigator.push({
      id: 'OrderDetail',
      title: LANG.t('order.OrderDetail'),
      passProps: {
        event: order.event,
        order
      }
    })
  },

  renderRow = (order, sectionId, rowId) => {
    const infoStyles = {
        wrapper: {
          height: 22,
          paddingLeft: 0,
          paddingVertical: 0
        }
      },
      {event} = order,
      dates = UTIL.formatDateSpan(order.startDate, order.daySpan),
      names = [],
      heroUri = ImagePath({type: 'thumb', path: UTIL.getEventHeroPath(event)})

      order.signUps.map((signUp) => {
        names.push(signUp.name)
      })

    return (
      <TouchableOpacity key={rowId} onPress={() => selectOrder(order)}>
        <View style={[styles.list.item, styles.list.borders, {flex: 0}]}>
          <Image
            style={styles.list.thumb}
            source={{uri: heroUri}}
          />
          <View style={styles.list.content}>
            <View style={styles.list.title}>
              <TextView
                style={{fontWeight: '400', marginBottom: 2}}
                fontSize={'L'}
                text={order.title} 
              />
              <TextView
                fontSize={'SML'}
                textColor={Graphics.textColors.endnote}
                text={dates} 
              />
            </View>
            <View>
              <InfoItem
                labelWidth={75}
                styles={infoStyles}
                label={LANG.t('order.SignUps')}
                value={names.join('，')}
              />
              <InfoItem
                labelWidth={75}
                styles={infoStyles}
                label={LANG.t('order.Total')}
                value={LANG.t('number.currency', {amount: order.subTotal})}
              />
              <InfoItem
                labelWidth={75}
                styles={infoStyles}
                label={LANG.t('order.PayTime')}
                value={UTIL.getTimeFromId(order._id).format(AppSettings.defaultDateTimeFormat)}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ListView
      automaticallyAdjustContentInsets={false}
      enableEmptySections={true}
      removeClippedSubviews={false}
      scrollEnabled={true}
      dataSource={dataSource.cloneWithRows(props.orders)}
      renderRow={renderRow}
    />
  )
}

OrderList.propTypes = {
  navigator: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired
}

export default OrderList
