import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

const cellSize = 80

const s = StyleSheet.create({
  item: {
    width: cellSize,
    height: cellSize,
    backgroundColor: '#99f',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    margin: 8,
  },
  text: {
    color: '#9f9',
    fontSize: 14,
  }
})

export default class ListItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.string.isRequired,
  }

  render() {
    const { item } = this.props
    return (
      <TouchableOpacity onLongPress={() => console.log('LONG')}>
        <View style={s.item}>
          <Text style={s.text}>{item}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
