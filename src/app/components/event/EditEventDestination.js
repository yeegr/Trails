'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as newEventActions from '../../redux/actions/newEventActions'

import RichTextEditor from '../shared/RichTextEditor'

import styles from '../../styles/main'

import {
  LANG
} from '../../settings'

class EditEventDestination extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: this.props.text
    }
  }

  componentWillUnmount() {
    let text = this.state.text.trim()
    this.props.newEventActions.setEventDestination(text)
  }

  render() {
    return (
      <View style={styles.global.wrapper}>
        <View style={styles.editor.list}>
          <RichTextEditor
            placeholder={LANG.t('event.DestinationDescription')}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
        </View>
      </View>
    )
  }
}

EditEventDestination.propTypes = {
  navigator: PropTypes.object.isRequired,
  newEventActions: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    text: state.newEvent.destination
  }
}

function mapDispatchToProps(dispatch) {
  return {
    newEventActions: bindActionCreators(newEventActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventDestination)