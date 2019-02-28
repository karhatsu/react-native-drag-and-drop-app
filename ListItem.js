import React from 'react'
import PropTypes from 'prop-types'
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native"

export const cellHeight = 80
export const cellMargin = 8

const s = StyleSheet.create({
  item: {
    height: cellHeight,
    backgroundColor: '#99f',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    margin: cellMargin,
  },
  text: {
    color: '#9f9',
    fontSize: 14,
  }
})

export default class ListItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    onLongPress: PropTypes.func,
    onPressOut: PropTypes.func,
    style: PropTypes.object,
    width: PropTypes.number.isRequired,
  }

  render() {
    const { item: { text }, onLongPress, onPressOut, style, width } = this.props
    return (
      <TouchableOpacity onLongPress={onLongPress} onPressOut={onPressOut} delayLongPress={200}>
        <Animated.View style={[s.item, style, { width }]}>
          <Text style={s.text}>{text}</Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}
