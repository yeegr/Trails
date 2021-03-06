'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  TouchableOpacity,
  View,
} from 'react-native'

import ParallaxView from 'react-native-parallax-view'
import Alipay from 'react-native-yunpeng-alipay'
import * as WeChat from 'react-native-wechat'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as ordersActions from '../../../redux/actions/ordersActions'

import CallToAction from '../shared/CallToAction'
import Inset from '../shared/Inset'
import ImagePath from '../shared/ImagePath'
import Icon from '../shared/Icon'
import InfoItem from '../shared/InfoItem'
import Saving from '../shared/Saving'
import TextView from '../shared/TextView'

import styles from '../../styles/main'

import {
  CONSTANTS,
  LANG,
  UTIL,
  AppSettings,
  Lang,
  Graphics
} from '../../../../common/__'

class OrderPayment extends Component {
  constructor(props) {
    super(props)
    this._confirm = this._confirm.bind(this)
    this._pay = this._pay.bind(this)
    this._wechatPay = this._wechatPay.bind(this)
    this._cancelPayment = this._cancelPayment.bind(this)

    this.state = {
      signUps: this.props.signUps,
      paymentMethod: AppSettings.defaultPaymentMethod,
      isPaying: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let {order} = nextProps

    if (order !== null) {
      if (this.props.order === null && order.subTotal > 0 && order.status === 'pending') {
        this.setState({isPaying: false})
        this._pay(order)
      } else if (order.status === 'success') {
        this.props.navigator.replace({
          id: 'OrderSuccess',
          title: LANG.t('order.OrderSuccess'),
          passProps: {
            event: this.props.event,
            order
          }
        })
      }
    }
  }

  componentWillUnmount() {
    this.props.ordersActions.resetOrder()
  }

  _confirm(subTotal) {
    this.setState({isPaying: true})

    subTotal = (subTotal > 0) ? 0.02 : subTotal

    let {user, event, selectedGroup} = this.props,
      order = {
        type: CONSTANTS.ORDER_TYPES.SIGNUP,
        channel: CONSTANTS.ORDER_CHANNELS.APP,
        creator: user.id,
        event: event.id,
        group: selectedGroup,
        title: event.title,
        body: UTIL.formatEventGroupLabel(event, selectedGroup),
        hero: event.hero,
        startDate: event.groups[selectedGroup].startDate,
        daySpan: event.schedule.length, 
        method: this.state.paymentMethod,
        signUps: this.state.signUps,
        subTotal,
        status: (subTotal === 0) ? 'success' : 'pending'
      }

    this.props.ordersActions.createOrder(order)
  }

  _pay(order) {
    switch (order.method) {
      case 'Alipay':
        Alipay
        .pay(order.Alipay)
        .then((data) => {
          let result = {}

          result.response = JSON.parse(data[0].result)
          result.resultStatus = data[0].resultStatus
          result.method = order.method

          this.props.ordersActions.updateOrder(result)
        }, (err) => {
          this._cancelPayment(err)
        })
      break

      case 'WeChatPay':
        this._wechatPay(order)
      break
    }
  }

  async _wechatPay(order) {
    try {
      let tmp = await WeChat.pay(order.WeChatPay),
        result = {}

      result.response = order
      result.resultStatus = tmp.errCode
      result.method = order.method
      this.props.ordersActions.updateOrder(result)
    } catch (err) {
      this._cancelPayment(err)
    }
  }

  _cancelPayment(err) {
    this.props.ordersActions.resetOrder()
    //console.log(err)
  }

  render() {
    const {event, navigator} = this.props,
      eventBackgroundUrl = ImagePath({type: 'background', path: UTIL.getEventHeroPath(event)}),
      selectedGroup = this.props.selectedGroup,
      dates = UTIL.formatEventGroupLabel(event, selectedGroup)

    const paymentMethodSelector = (event.expenses.perHead > 0) ? (
      <View style={styles.detail.section}>
        <TextView
          class={'h2'}
          text={LANG.t('order.SelectPaymentMethod')}
        />
        <View style={styles.editor.group}>
        {
          AppSettings.paymentMethods.map((method, index) => {
            const checkmark = (method.value === this.state.paymentMethod) ? (
              <Icon 
                backgroundColor={Graphics.colors.transparent} 
                fillColor={Graphics.colors.primary} 
                sideLength={36}
                type={'checkmark'}
              />
            ) : null
            
            let paymentIcon = null

            switch (method.value) {
              case 'Alipay':
                paymentIcon = (
                  <Icon 
                    backgroundColor={Graphics.colors.transparent} 
                    fillColor={Graphics.colors.alipay} 
                    sideLength={24}
                    path={Graphics.pictograms.alipay}
                  />
                )
              break

              case 'WeChatPay':
                paymentIcon = (
                  <Icon 
                    backgroundShape={'rsquare'}
                    backgroundColor={Graphics.colors.wechat}
                    fillColor={Graphics.colors.white} 
                    sideLength={24}
                    path={Graphics.pictograms.wechat}
                  />
                )
              break
            }

            return (
              <TouchableOpacity 
                key={index} 
                onPress={() => this.setState({paymentMethod: method.value})}
              >
                <View style={styles.editor.link}>
                  <View style={styles.editor.icon}>
                    {paymentIcon}
                  </View>
                  <View style={styles.editor.label}>
                    <TextView text={method.label} />
                  </View>
                  <View style={styles.editor.value}>
                    {checkmark}
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        }
        </View>
      </View>
    ) : null

    let subTotal = 0

    return (
      <View style={styles.global.wrapper}>
        <ParallaxView
          backgroundSource={{uri: eventBackgroundUrl}}
          windowHeight={Graphics.heroImage.height}
          header={(
            <Inset
              align={'bottom'}
              title={event.title}
              excerpt={event.excerpt}
            />
          )}>
          <View style={styles.detail.article}>
            <View style={styles.detail.section}>
              <TextView class={'h2'} text={Lang.EventInfo} />
              <View style={styles.detail.group}>
                <InfoItem label={Lang.EventDates} value={dates} />
                <InfoItem label={Lang.PerHead} value={LANG.t('number.currency', {amount: event.expenses.perHead})} />
              </View>
            </View>
            <View style={styles.detail.section}>
              <TextView class={'h2'} text={Lang.SignUps} />
              <View style={[styles.detail.group, {marginBottom: 0}]}>
              {
                this.state.signUps.map((signUp, index) => {
                  let payment = UTIL.calculateInsurance(event, signUp)
                  signUp.payment = payment
                  signUp.cost = payment.cost
                  subTotal += payment.cost

                  return (
                    <InfoItem
                      key={index}
                      align={'right'}
                      noColon={true}
                      label={signUp.name}
                      value={LANG.t('number.currency', {amount: payment.cost})}
                      more={{
                        label: LANG.t('order.Detail'),
                        onPress: () => {
                          navigator.push({
                            id: 'OrderSummary',
                            title: Lang.OrderSummary,
                            passProps: {
                              event,
                              selectedGroup,
                              signUp
                            }
                          })
                        }
                      }}
                    />
                  )
                })
              }
              </View>
              <View style={{marginTop: 5}}>
                <InfoItem
                  align={'right'} 
                  label={LANG.t('order.SubTotal')}
                  value={LANG.t('number.currency', {amount: subTotal})}
                  more={{label: '　　'}}
                />
              </View>
            </View>
            {paymentMethodSelector}
          </View>
        </ParallaxView>
        <CallToAction
          backgroundColor={Graphics.colors.primary}
          label={LANG.t('order.ConfirmOrder')}
          onPress={() => this._confirm(subTotal)}
        />
        <Saving
          visible={this.state.isPaying}
        />
      </View>
    )
  }
}

OrderPayment.propTypes = {
  user: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  selectedGroup: PropTypes.number.isRequired,
  signUps: PropTypes.array.isRequired,
  order: PropTypes.object,
  ordersActions: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.login.user,
    order: state.orders.order
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ordersActions: bindActionCreators(ordersActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPayment)
