'use strict'

import {
  AppSettings,
  Lang,
  Graphics
} from '../../settings'

import React, {
  Component,
  PropTypes
} from 'react'

import {View} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as newEventActions from '../../containers/actions/newEventActions'

import ListEditor from '../shared/ListEditor'
import styles from '../../styles/main'

class EditEventNotes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: this.props.notes
    }
  }

  componentWillUnmount() {
    this.props.newEventActions.setEventNotes(this.state.notes)
  }

  render() {
    return (
      <View style={styles.editor.scroll}>
        <ListEditor list={this.state.notes} />
      </View>
    )
  }
}

EditEventNotes.propTypes = {
  notes: PropTypes.array.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    notes: state.newEvent.notes
  }
}

function mapDispatchToProps(dispatch) {
  return {
    newEventActions: bindActionCreators(newEventActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventNotes)
