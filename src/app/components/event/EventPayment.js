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

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as eventsActions from '../../redux/actions/eventsActions'

import CallToAction from '../shared/CallToAction'
import ImagePath from '../shared/ImagePath'
import Icon from '../shared/Icon'
import InfoItem from '../shared/InfoItem'
import Intro from '../shared/Intro'
import TextView from '../shared/TextView'

import styles from '../../styles/main'

import {
  CONSTANTS,
  UTIL,
  AppSettings,
  Lang,
  Graphics
} from '../../settings'

class EventPayment extends Component {
  constructor(props) {
    super(props)
    this.confirm = this.confirm.bind(this)
    this.nextStep = this.nextStep.bind(this)

    this.state = {
      signUps: this.props.signUps,
      paymentMethod: AppSettings.defaultPaymentMethod,
      total: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.events.order) {
      this.nextStep(nextProps.events.order)
    }
  }

  componentWillUnmount() {
    this.props.eventsActions.resetOrder()
  }

  nextStep(order) {
    console.log(order)

    let {event, navigator} = this.props,
      stack = navigator.getCurrentRoutes()

    stack.splice(2, stack.length - 3)
    navigator.immediatelyResetRouteStack(stack)

    setTimeout(() => {
      navigator.replace({
        id: 'OrderDetail',
        title: Lang.OrderDetail,
        passProps: {
          event,
          order
        }
      })
    }, 0)

  }

  confirm(total) {
    let {user, event, selectedGroup} = this.props,
      order = {
      creator: user.id,
      event: event.id,
      selectedGroup,
      title: event.title,
      hero: event.hero,
      startDate: event.groups[selectedGroup].startDate,
      daySpan: event.schedule.length, 
      method: this.state.paymentMethod,
      signUps: this.state.signUps,
      total 
    }

    console.log(order)

    this.props.eventsActions.pay(order)
  }

  render() {
    const {event, navigator} = this.props,
      eventBackgroundUrl = ImagePath({type: 'background', path: CONSTANTS.ASSET_FOLDERS.Event + '/' + event._id + '/' + event.hero}),
      selectedGroup = this.props.selectedGroup,
      dates = UTIL.formatEventGroupLabel(event, selectedGroup)
      //deposit = (event.expenses.deposit) ? <InfoItem label={Lang.Deposit} value={event.expenses.deposit + Lang.Yuan} /> : null

    const paymentMethodSelector = (event.expenses.perHead > 0) ? (
      <View style={styles.detail.section}>
        <TextView class={'h2'} text={Lang.PaymentMethod} />
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

            return (
              <TouchableOpacity 
                key={index} 
                onPress={() => this.setState({paymentMethod: method.value})}>
                <View style={[styles.editor.link, {}]}>
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

    let total = 0

    return(
      <View style={styles.global.wrapper}>
        <ParallaxView
          backgroundSource={{uri: eventBackgroundUrl}}
          windowHeight={Graphics.heroImage.height}
          header={(
            <Intro
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
                <InfoItem label={Lang.PerHead} value={event.expenses.perHead.toString() + Lang.Yuan} />
              </View>
            </View>
            <View style={styles.detail.section}>
              <TextView class={'h2'} text={Lang.SignUps} />
              <View style={[styles.detail.group, {marginBottom: 0}]}>
                {
                  this.state.signUps.map((signUp, index) => {
                    let payment = UTIL.calculateInsurance(event, signUp)
                    signUp.payment = payment
                    total += payment.subTotal

                    return (
                      <InfoItem
                        key={index}
                        align={'right'}
                        noColon={true}
                        label={signUp.name}
                        value={payment.subTotal.toString() + Lang.Yuan}
                        more={{
                          label: Lang.Detail,
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
                  label={Lang.Total}
                  value={UTIL.formatCurrency(total).toString() + Lang.Yuan}
                  more={{label: '　　'}}
                />
              </View>
            </View>
            {paymentMethodSelector}
          </View>
        </ParallaxView>
        <CallToAction
          backgroundColor={Graphics.colors.primary}
          label={Lang.Confirm}
          onPress={() => this.confirm(total)}
        />
      </View>
    )
  }
}

EventPayment.propTypes = {
  navigator: PropTypes.object.isRequired,
  eventsActions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  selectedGroup: PropTypes.number.isRequired,
  signUps: PropTypes.array.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.login.user,
    events: state.events
  }
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions: bindActionCreators(eventsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPayment)