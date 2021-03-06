'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import KeyboardSpacer from 'react-native-keyboard-spacer'
import * as WeChat from 'react-native-wechat'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../../redux/actions/userActions'

import Icon from '../components/shared/Icon'
import ImagePath from '../components/shared/ImagePath'
import TextView from '../components/shared/TextView'

import {
  CONSTANTS,
  LANG,
  AppSettings,
  Graphics
} from '../../../common/__'

class Login extends Component {
  constructor(props) {
    super(props)
    this._hideLogin = this._hideLogin.bind(this)
    this._resetState = this._resetState.bind(this)
    this._onMobileNumberChanged = this._onMobileNumberChanged.bind(this)
    this._getVerification = this._getVerification.bind(this)
    this._onVerificationCodeChanged = this._onVerificationCodeChanged.bind(this)
    this._onLoginPressed = this._onLoginPressed.bind(this)
    this.WXAuth = this.WXAuth.bind(this)

    this._scrollHeight = 0
    this.counter = AppSettings.getVerificationTimer

    this.init = {
      mobileNumber: '',
      verificationCode: '',

      disableMobileNumberInput: false,
      disableVerificationButton: true,
      getVerificationButtonText: LANG.t('login.GetVerificationCode'),
      showVerificationView: false,
      disableVerificationInput: false,
      disableLoginButton: true
    }

    this.state = Object.assign({}, this.init, {
      apiVersion: 'waiting...',
      wxAppInstallUrl: 'waiting...',
      isWXAppSupportApi: 'waiting...',
      isWXAppInstalled: 'waiting...'
    })
  }

  async componentDidMount() {
    try {
      await WeChat.registerApp(AppSettings.sdks.wechat)

      this.setState({
        apiVersion: await WeChat.getApiVersion(),
        wxAppInstallUrl: await WeChat.getWXAppInstallUrl(),
        isWXAppSupportApi: await WeChat.isWXAppSupportApi(),
        isWXAppInstalled: await WeChat.isWXAppInstalled()
      })

      WeChat.addListener('SendAuth.Resp', (res) => {
        if (this.props.login.action === CONSTANTS.ACCOUNT_ACTIONS.LOGIN) {
          if (res.errCode === 0) {
            this.props.userActions.wechatAuthSuccess(res.code)
          } else {
            this.props.userActions.wechatAuthFailure(res)
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.action === CONSTANTS.ACCOUNT_ACTIONS.LOGIN) {
      if (nextProps.login.isAuthorizingWeChat) {
        this.WXAuth()
      }
    }

    if (!nextProps.login.showLogin) {
      this._resetState()
    }
  }
  
  WXAuth() {
    if (this.state.isWXAppInstalled) {
      this.props.userActions.wechatAuthRequest(CONSTANTS.ACCOUNT_ACTIONS.LOGIN)
      
      WeChat
      .sendAuthRequest('snsapi_userinfo', 'shitulv_login')
      .catch((e) => {console.log(e)})
      
      this.props.userActions.wechatAuthWaiting()
    }
  }

  _resetState() {
    this.setState(this.init)
  }

  _onMobileNumberChanged(val) {
    let mobileNumber = val.trim(),
      test = AppSettings.mobileRx.test(mobileNumber)

    this.props.userActions.resetVerificationError()

    if (test && this.counter === AppSettings.getVerificationTimer) {
      this.setState({
        mobileNumber,
        disableVerificationButton: false
      })
    } else {
      this.setState({
        mobileNumber,
        disableVerificationButton: true,
        showVerificationView: false,
        verificationCode: '',
        disableVerificationInput: false
      })
    }
  }

  _getVerification() {
    this.props.userActions.uploadMobileNumber(this.state.mobileNumber, CONSTANTS.ACCOUNT_ACTIONS.LOGIN)

    this.setState({
      disableVerificationButton: true,
      showVerificationView: true,
      verificationCode: ''
    })

    if (AppSettings.device.height < 736) {
      this.refs.scrollView.scrollTo({x: 0, y: this._scrollHeight + 10, animated: true})
    }

    this.interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--
        this.setState({
          getVerificationButtonText: LANG.t('login.ResendVerificationCodeIn', {count: this.counter})
        })
      } else {
        clearInterval(this.interval)
        this.counter = AppSettings.getVerificationTimer
        this.setState({
          getVerificationButtonText: this.init.getVerificationButtonText,
          disableVerificationButton: false
        })
      }
    }, 1000)
  }

  _onVerificationCodeChanged(val) {
    let verificationCode = val.trim()

    this.props.userActions.resetVerificationError()

    this.setState({
      verificationCode,
      disableLoginButton: !AppSettings.vcodeRx.test(verificationCode)
    })
  }

  _onLoginPressed() {
    this.props.userActions.verifyMobileNumber(
      this.state.mobileNumber,
      this.state.verificationCode,
      CONSTANTS.ACCOUNT_ACTIONS.LOGIN
    )
  }

  _hideLogin() {
    this.props.userActions.hideLogin()
  }

  render() {
    let {login} = this.props,
      {
        mobileNumber,
        verificationCode,
        disableMobileNumberInput, 
        disableVerificationButton, 
        showVerificationView,
        disableVerificationInput,
        disableLoginButton,
        getVerificationButtonText
      } = this.state,
      labelStyles = {backgroundColor: 'transparent', fontWeight: '400', paddingHorizontal: 4},
      verificationButtonStyle = (disableVerificationButton) ? styles.buttonDisabled : styles.buttonEnabled,
      loginButtonStyle = (disableLoginButton) ? styles.buttonDisabled : styles.buttonEnabled,

      verificationView = (
        <View style={styles.inputGroup}>
          <TextView
            style={labelStyles}
            textColor={Graphics.textColors.overlay} 
            text={LANG.t('login.VerificationCode')}
          />
          <TextInput
            autoFocus={true}
            autoCorrect={false}
            disabled={disableVerificationInput}
            keyboardType="numeric"
            maxLength={AppSettings.verificationCodeLength}
            style={styles.loginInput}
            placeholder={LANG.t('login.VerificationCode')}
            placeholderTextColor={Graphics.colors.placeholder}
            onFocus={() => {this.setState({verificationCode: ''})}}
            onChangeText={(value) => !disableVerificationInput && this._onVerificationCodeChanged(value)}
            value={verificationCode}
          />
          <TouchableOpacity
            disabled={disableLoginButton}
            onPress={this._onLoginPressed} 
            style={[styles.button, loginButtonStyle]}
          >
            <TextView
              fontSize={'XXXL'}
              textColor={Graphics.textColors.overlay}
              text={LANG.t('login.LoginOrRegister')}
            />
          </TouchableOpacity>
          <TextView
            fontSize={'L'}
            style={{marginTop: 10, textAlign: 'center'}}
            textColor={Graphics.colors.warning}
            text={login.loginError}
          />
        </View>
      ),

      mobileLoginForm = (
        <View style={styles.loginForm}>
          <View style={styles.inputGroup}>
            <TextView
              style={labelStyles}
              textColor={Graphics.textColors.overlay} 
              text={LANG.t('login.LoginViaMobileNumber')}
            />
            <TextInput
              autoFocus={true}
              autoCorrect={false}
              disabled={disableMobileNumberInput}
              keyboardType="phone-pad"
              maxLength={AppSettings.mobileNumberLength}
              placeholder={LANG.t('login.MobileNumberPlaceholder')}
              placeholderTextColor={Graphics.colors.placeholder}
              value={mobileNumber}
              onChangeText={this._onMobileNumberChanged}
              style={styles.loginInput}
            />
            <TouchableOpacity
              disabled={disableVerificationButton}
              style={[styles.button, verificationButtonStyle]}
              onPress={() => !disableVerificationButton && this._getVerification()}
            >
              <TextView
                fontSize={'XXXL'}
                textColor={Graphics.textColors.overlay}
                text={getVerificationButtonText}
              />
            </TouchableOpacity>
          </View>
          {showVerificationView ? verificationView : null}
        </View>
      ),

      loginProgress = (
        <ActivityIndicator
          animating={true}
          size={'large'}
          style={styles.loginProgress}
        />
      ),

      wechatAuthButton = (this.state.isWXAppInstalled) ? (
        <View style={[styles.weixinLogin, styles.inputGroup]}>
          <TextView
            style={labelStyles}
            textColor={Graphics.textColors.overlay} 
            text={LANG.t('login.OrUseWeChat')}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonEnabled]}
            onPress={this.WXAuth}
          >
            <TextView
              fontSize={'XXXL'}
              textColor={Graphics.textColors.overlay}
              text={LANG.t('login.LoginViaWeChat')}
            />
          </TouchableOpacity>
        </View>
      ) : null

    const uri = ImagePath({type: 'background', path: AppSettings.loginBackground})

    return (
      <Modal animationType={'slide'} transparent={false} visible={login.showLogin}>
        <Image resizeMode={'cover'} source={{uri}} style={styles.backgroundImage}>
          <View style={{flex: 1}}>
            <ScrollView
              ref="scrollView"
              style={{marginTop: 10}}
              onContentSizeChange={(width, height) => {
                this._scrollHeight = height
              }}
            >
              {login.showMobileLogin ? mobileLoginForm : null}
            </ScrollView>
            {login.isFetching ? loginProgress : null}
            {login.showWeChatLogin ? wechatAuthButton : null}
          </View>
          <KeyboardSpacer />
          <TouchableOpacity onPress={this._hideLogin} style={styles.closeButton}>
            <Icon
              backgroundColor={Graphics.colors.transparent}
              fillColor="rgba(255, 255, 255, 0.8)"
              type={'close'}
            />
          </TouchableOpacity>
        </Image>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    backgroundColor: Graphics.colors.lightGray,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padding: 50,
    paddingBottom: 30,
    resizeMode: 'cover'
  },
  closeButton: {
    height: Graphics.icon.sideLength,
    right: 15,
    top: 30,
    position: 'absolute',
    width: Graphics.icon.sideLength
  },
  loginForm: {
    backgroundColor: 'transparent'
  },
  weixinLogin: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  loginInput: {
    color: Graphics.colors.foreground,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    fontSize: 24,
    height: 50,
    marginTop: 10,
    padding: 4,
    textAlign: 'center'
  },
  inputGroup: {
    marginTop: 20
  },
  button: {
    height: 50,
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  buttonEnabled: {
    backgroundColor: Graphics.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: "#666",
    opacity: 0.8
  }
})

Login.propTypes = {
  userActions: PropTypes.object.isRequired,
  login: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    login: state.login
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
