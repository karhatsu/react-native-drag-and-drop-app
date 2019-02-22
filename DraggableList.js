import React from 'react'
import PropTypes from 'prop-types'
import { Animated, FlatList, PanResponder, StyleSheet, View } from 'react-native'

const s = StyleSheet.create({
  dragComponentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})

const left = -1
const right = 1

const defaultState = {
  dragComponent: undefined,
  dragComponentIndex: -1,
  dragDirection: 0,
  targetIndex: -1,
}

export default class DraggableList extends React.PureComponent {
  static propTypes = {
    cellSize: PropTypes.number.isRequired,
    contentContainerStyle: PropTypes.object,
    items: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = defaultState
    this.dragging = false
    this.dragStartComponentLeft = 0
    this.dragStart = new Animated.Value(0)
    this.dragMove = new Animated.Value(0)
    this.drag = Animated.add(this.dragStart, this.dragMove)
    this.panResponder = this.createPanResponder(props.cellSize)
  }

  createPanResponder = (cellSize) => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: (event) => {
        const { pageX } = event.nativeEvent
        this.dragStartComponentLeft = pageX - pageX % cellSize
        this.dragStart.setValue(this.dragStartComponentLeft)
        return false
      },
      onMoveShouldSetPanResponder: () => {
        this.dragging = !!this.state.dragComponent
        return this.dragging
      },
      onPanResponderMove: (event, gestureState) => {
        const { cellSize } = this.props
        const { dx } = gestureState
        this.dragMove.setValue(dx)
        const dragStartComponentMiddle = this.dragStartComponentLeft + cellSize / 2
        const dragDirection = dx < 0 ? left : right
        const targetIndex = Math.floor((dragStartComponentMiddle + dx) / cellSize)
        //console.log('middle', dragStartComponentMiddle, 'dx', dx, 'targetIndex', targetIndex)
        if (targetIndex !== this.state.targetIndex || dragDirection !== this.state.dragDirection) {
          //console.log('dragDirection:', this.state.dragDirection, '->', dragDirection)
          //console.log('targetIndex:', this.state.targetIndex, '->', targetIndex)
          this.setState({ dragDirection, targetIndex })
        }
      },
      onPanResponderRelease: () => {
        this.setState(defaultState)
        this.dragging = false
        this.dragMove.setValue(0)
      },
    })
  }

  resolveDragComponentContainerStyles = () => {
    return [
      s.dragComponentContainer,
      { transform: [{ translateX: this.drag }] }
    ]
  }

  renderDragComponent = () => {
    const { dragComponent } = this.state
    return !!dragComponent && (
      <Animated.View style={this.resolveDragComponentContainerStyles()}>
        {dragComponent}
      </Animated.View>
    )
  }

  onItemLongPress = (item, index) => {
    return () => {
      const dragComponent = this.renderItem({ item })
      this.setState({ dragComponent, dragComponentIndex: index, targetIndex: index })
    }
  }

  onItemPressOut = () => {
    if (!this.dragging) this.setState(defaultState)
  }

  renderPlaceholderItem = () => {
    const { cellSize } = this.props
    return <View style={{ width: cellSize, height: cellSize, borderWidth: 1, borderColor: 'red' }}/>
  }

  renderItem = ({ item, index }) => {
    const { items, renderItem } = this.props
    const { dragComponentIndex, dragDirection, targetIndex } = this.state
    const hiddenStyle = dragComponentIndex === index ? { width: 0, overflow: 'hidden' } : undefined
    let renderEmptySpaceToLeft = targetIndex !== -1 && targetIndex + 1 === index
    let renderEmptySpaceToRight = targetIndex === index && index + 1 === items.length
    if (dragDirection === left) {
      renderEmptySpaceToLeft = targetIndex === 0 && index === 0
      renderEmptySpaceToRight = targetIndex - 1 === index
    }
    //console.log('dragComponentIndex', dragComponentIndex, 'index', index, 'hiddenStyle', hiddenStyle, 'left', renderEmptySpaceToLeft, 'right', renderEmptySpaceToRight)
    return (
      <View style={{ flexDirection: 'row' }}>
        {renderEmptySpaceToLeft && this.renderPlaceholderItem()}
        <View style={hiddenStyle}>
          {renderItem({ item, onLongPress: this.onItemLongPress(item, index), onPressOut: this.onItemPressOut })}
        </View>
        {renderEmptySpaceToRight && this.renderPlaceholderItem()}
      </View>
    )
  }

  render() {
    const { contentContainerStyle, items, keyExtractor } = this.props
    return (
      <View {...this.panResponder.panHandlers}>
        <FlatList
          contentContainerStyle={contentContainerStyle}
          data={items}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
          scrollEnabled={!this.state.dragComponent}
        />
        {this.renderDragComponent()}
      </View>
    )
  }
}
