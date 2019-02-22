import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import DraggableList from './DraggableList'
import ListItem, { cellMargin, cellSize } from './ListItem'

const s = StyleSheet.create({
  root: {
    height: 100,
    marginVertical: 30,
  },
  list: {
    backgroundColor: 'rgba(128,255,128,0.5)',
  },
})

export default class List extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  renderItem = ({ item, onLongPress, onPressOut }) => {
    return <ListItem item={item} onLongPress={onLongPress} onPressOut={onPressOut}/>
  }

  keyExtractor = (item, index) => {
    return `key-${index}`
  }

  render() {
    return (
      <View style={s.root}>
        <DraggableList
          cellSize={cellSize + 2 * cellMargin}
          contentContainerStyle={s.list}
          items={this.props.items}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
