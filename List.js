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
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    onReorder: PropTypes.func.isRequired,
  }

  renderItem = ({ item, onLongPress, onPressOut }) => {
    return <ListItem item={item} onLongPress={onLongPress} onPressOut={onPressOut}/>
  }

  keyExtractor = (item) => {
    return `key-${item.id}`
  }

  render() {
    return (
      <View style={s.root}>
        <DraggableList
          cellSize={cellSize + 2 * cellMargin}
          contentContainerStyle={s.list}
          items={this.props.items}
          keyExtractor={this.keyExtractor}
          onReorder={this.props.onReorder}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
