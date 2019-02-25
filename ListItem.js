import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const cellSize = 80
export const cellMargin = 8

const s = StyleSheet.create({
  item: {
    width: cellSize,
    height: cellSize,
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
  }

  render() {
    const { item: { text }, onLongPress, onPressOut } = this.props
    return (
      <TouchableOpacity onLongPress={onLongPress} onPressOut={onPressOut}>
        <View style={s.item}>
          <Text style={s.text}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
