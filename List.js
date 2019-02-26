import React from 'react'
import PropTypes from 'prop-types'
import { Button, StyleSheet, View } from 'react-native'
import DraggableList from './DraggableList'
import ListItem, { cellMargin, cellHeight } from './ListItem'

const s = StyleSheet.create({
  root: {
    height: cellHeight + 2 * cellMargin,
    marginVertical: 30,
  },
  list: {
    backgroundColor: 'rgba(128,255,128,0.5)',
  },
})

export default class List extends React.PureComponent {
  static propTypes = {
    extraItem: PropTypes.bool.isRequired,
    itemsCount: PropTypes.number.isRequired,
    itemText: PropTypes.string.isRequired,
    itemWidth: PropTypes.number.isRequired,
    reorderEnabled: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      items: this.initItems(),
    }
  }

  renderItem = ({ item, onLongPress, onPressOut }) => {
    return <ListItem item={item} onLongPress={onLongPress} onPressOut={onPressOut} width={this.props.itemWidth}/>
  }

  keyExtractor = (item) => {
    return `key-${item.id}`
  }

  reorderItems = items => {
    this.setState({ items })
  }

  deleteItem = index => {
    const { items } = this.state
    items.splice(index, 1)
    this.setState({ items })
  }

  resetData = () => {
    this.setState({ items: this.initItems() })
  }

  initItems = () => {
    const { extraItem, itemsCount, itemText } = this.props
    const items = []
    for (let i = 0; i < itemsCount; i++) {
      items.push({ id: i, text: `${itemText} ${i}` })
    }
    if (extraItem) {
      items.push({ id: itemsCount, text: '➕' })
    }
    return items
  }

  render() {
    const { extraItem, itemWidth, reorderEnabled } = this.props
    const cellTotalSize = {
      height: cellHeight + 2 * cellMargin,
      width: itemWidth + 2 * cellMargin
    }
    return (
      <View style={s.root}>
        <Button onPress={this.resetData} title="Reset data"/>
        <DraggableList
          cellTotalSize={cellTotalSize}
          contentContainerStyle={s.list}
          deleteItem={this.deleteItem}
          extraItemIndex={extraItem ? this.state.items.length - 1 : undefined}
          items={this.state.items}
          keyExtractor={this.keyExtractor}
          onReorder={reorderEnabled ? this.reorderItems : undefined}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
