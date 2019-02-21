import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, StyleSheet, Text, View } from 'react-native'

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

export default class DraggableList extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  renderItem = ({ item }) => {
    return <View style={s.item}><Text style={s.text}>{item}</Text></View>
  }

  keyExtractor = (item, index) => {
    return `key-${index}`
  }

  render() {
    return (
      <FlatList
        data={this.props.items}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        horizontal={true}
      />
    )
  }
}
