import React from 'react'
import PropTypes from 'prop-types'
import { Button, StyleSheet, View } from 'react-native'
import DraggableList from './DraggableList'
import ListItem, { cellMargin, cellHeight } from './ListItem'

const containerHorizontalPadding = 8

const s = StyleSheet.create({
  root: {
    height: cellHeight + 2 * cellMargin,
    width: '100%',
    marginVertical: 30,
  },
  list: {
    backgroundColor: 'rgba(128,255,128,0.5)',
    paddingHorizontal: containerHorizontalPadding,
  },
})

export default class List extends React.PureComponent {
  static propTypes = {
    canDeleteLast: PropTypes.bool.isRequired,
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
    const { itemWidth } = this.props
    if (item.extra) {
      return <ListItem item={item} width={itemWidth}/>
    }
    return <ListItem item={item} onLongPress={onLongPress} onPressOut={onPressOut} width={itemWidth}/>
  }

  keyExtractor = (item) => {
    return `key-${item.id || item.extra}`
  }

  reorderItems = items => {
    this.setState({ items })
  }

  onDeleteItem = deleteItem => {
    const items = [...this.state.items]
    const index = items.findIndex(item => item.id === deleteItem.id)
    items.splice(index, 1)
    this.setState({ items })
  }

  resetData = () => {
    this.setState({ items: this.initItems() })
  }

  initItems = () => {
    const { itemsCount, itemText } = this.props
    const items = []
    for (let i = 0; i < itemsCount; i++) {
      items.push({ id: i, text: `${itemText} ${i}` })
    }
    return items
  }

  render() {
    const { canDeleteLast, extraItem, itemWidth, reorderEnabled } = this.props
    const cellTotalSize = {
      height: cellHeight + 2 * cellMargin,
      width: itemWidth + 2 * cellMargin
    }
    return (
      <View style={s.root}>
        <Button onPress={this.resetData} title="Reset data"/>
        <DraggableList
          canDeleteLast={canDeleteLast}
          cellTotalSize={cellTotalSize}
          contentContainerHorizontalPadding={containerHorizontalPadding}
          contentContainerStyle={s.list}
          onDeleteItem={this.onDeleteItem}
          extraItem={extraItem ? { extra: true, text: '➕' } : undefined}
          items={this.state.items}
          keyExtractor={this.keyExtractor}
          onReorder={reorderEnabled ? this.reorderItems : undefined}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
