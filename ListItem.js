import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

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
    width: PropTypes.number.isRequired,
  }

  render() {
    const { item: { text }, onLongPress, onPressOut, width } = this.props
    return (
      <TouchableOpacity onLongPress={onLongPress} onPressOut={onPressOut} delayLongPress={200}>
        <View style={[s.item, { width }]}>
          <Text style={s.text}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
