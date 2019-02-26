import React from 'react'
import PropTypes from 'prop-types'
import { Animated, Easing, FlatList, PanResponder, StyleSheet, Text, View } from 'react-native'

const s = StyleSheet.create({
  dragComponentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  trash: {
    backgroundColor: 'rgba(200, 10, 10, 0.6)',
    position: 'absolute',
    left: 0,
    right: 0,
  },
})

const scaleDuration = 100
const swapDuration = 300
const trashDropDuration = 200

const scrollMargin = 50
const scrollPixels = 20

const trashModes = {
  hidden: 0,
  available: 1,
  active: 2,
}

const noDraggingIndex = -1
const defaultDragState = {
  dragComponent: undefined,
  dragComponentStartIndex: noDraggingIndex,
}

const dragAnimationValue = {
  destroyed: -1,
  noDragging: 0,
  dragging: 1,
}

export default class DraggableList extends React.PureComponent {
  static propTypes = {
    cellSize: PropTypes.number.isRequired,
    contentContainerStyle: PropTypes.object,
    deleteItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      ...defaultDragState,
      containerWidth: 0,
    }
    this.scrollOffset = 0
    this.draggingStartScrollOffset = 0
    this.isAutoScrolling = false

    this.isDragging = false
    this.dragModeAnimatedValue = new Animated.Value(dragAnimationValue.noDragging)

    this.dragStartComponentLeft = 0
    this.dragAnimatedValue = new Animated.ValueXY({ x: 0, y: 0 })

    this.trashMode = trashModes.hidden
    this.trashModeAnimatedValue = new Animated.Value(this.trashMode)

    this.targetIndex = -2
    this.targetIndexAnimatedValue = new Animated.Value(this.targetIndex)

    this.panResponder = this.createPanResponder(props.cellSize)
  }

  createPanResponder = (cellSize) => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: (event) => {
        const { pageX } = event.nativeEvent
        this.dragStartComponentLeft = pageX - (pageX + this.scrollOffset) % cellSize
        this.dragAnimatedValue.setOffset({ x: this.dragStartComponentLeft, y: 0 })
        return false
      },
      onMoveShouldSetPanResponder: () => {
        this.isDragging = !!this.state.dragComponent
        return this.isDragging
      },
      onPanResponderMove: (event, gestureState) => {
        const { cellSize, items } = this.props
        const { pageX } = event.nativeEvent
        const { dx, dy } = gestureState
        this.dragAnimatedValue.setValue({ x: dx, y: dy })
        this.trashMode = dy < -cellSize / 2 ? trashModes.active : trashModes.available
        const dragStartComponentMiddle = this.scrollOffset + this.dragStartComponentLeft + cellSize / 2
        const targetIndex = this.trashMode === trashModes.active ? items.length : Math.floor((dragStartComponentMiddle + dx) / cellSize)
        this.trashModeAnimatedValue.setValue(this.trashMode)
        if (targetIndex !== this.targetIndex) {
          this.createSwapAnimation(targetIndex).start()
          this.targetIndex = targetIndex
        }
        this.isAutoScrollingPageX = pageX
        if (!this.isAutoScrolling) {
          this.isAutoScrolling = true
          this.scrollOnEdge()
        }
      },
      onPanResponderRelease: () => {
        if (this.trashMode === trashModes.active) {
          this.deleteItem()
        } else {
          this.moveItem()
        }
      },
    })
  }

  deleteItem = () => {
    this.createDraggableScaleAnimation(dragAnimationValue.destroyed).start(() => {
      this.props.deleteItem(this.state.dragComponentStartIndex)
      this.createTrashModeAnimation(trashModes.hidden).start(this.resetState)
    })
  }

  moveItem = () => {
    const { dragComponentStartIndex } = this.state
    const moved = this.targetIndex - this.state.dragComponentStartIndex
    const scrolledDuringDragging = this.scrollOffset - this.draggingStartScrollOffset
    const targetX = moved * this.props.cellSize - scrolledDuringDragging
    Animated.parallel([
      this.createDraggableScaleAnimation(dragAnimationValue.noDragging),
      this.createDropAnimation({ x: targetX, y: 0 })
    ]).start(() => {
      if (moved !== 0) {
        this.props.onReorder(this.reorderItems(dragComponentStartIndex, this.targetIndex))
      }
      this.resetState()
    })
  }

  createSwapAnimation = (targetIndex) => {
    return Animated.timing(this.targetIndexAnimatedValue, {
      toValue: targetIndex,
      duration: swapDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  }

  createDropAnimation = (toValue) => {
    return Animated.timing(this.dragAnimatedValue, {
      toValue,
      duration: scaleDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  }

  createDraggableScaleAnimation = (toValue) => {
    return Animated.timing(this.dragModeAnimatedValue, {
      toValue,
      duration: scaleDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  }

  createTrashModeAnimation = toValue => {
    return Animated.timing(this.trashModeAnimatedValue, {
      toValue,
      duration: trashDropDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  }

  scrollOnEdge = () => {
    let newScrollOffset = 0
    if (this.isAutoScrollingPageX < scrollMargin) {
      newScrollOffset = Math.max(0, this.scrollOffset - scrollPixels)
    } else if (this.isAutoScrollingPageX > this.state.containerWidth - scrollMargin) {
      newScrollOffset = this.scrollOffset + scrollPixels
    }
    if (newScrollOffset) {
      this.flatList.scrollToOffset({ offset: newScrollOffset })
      requestAnimationFrame(this.scrollOnEdge)
    } else {
      this.isAutoScrolling = false
    }
  }

  reorderItems = (fromIndex, toIndex) => {
    const items = [...this.props.items]
    const [item] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, item)
    return items
  }

  resetState = () => {
    this.targetIndex = -2
    this.targetIndexAnimatedValue.setValue(this.targetIndex)
    this.isDragging = false
    this.isAutoScrolling = false
    this.dragAnimatedValue.setValue({ x: 0, y: 0 })
    this.trashMode = trashModes.hidden
    this.trashModeAnimatedValue.setValue(this.trashMode)
    this.setState(defaultDragState)
  }

  resolveDragComponentContainerStyles = () => {
    return [
      s.dragComponentContainer,
      {
        transform: [
          { translateX: this.dragAnimatedValue.x },
          { translateY: this.dragAnimatedValue.y },
          {
            scale: this.dragModeAnimatedValue.interpolate({
              inputRange: [dragAnimationValue.destroyed, dragAnimationValue.noDragging, dragAnimationValue.dragging],
              outputRange: [0, 1, 1.125],
            }),
          }
        ]
      }
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
      const dragComponent = this.props.renderItem({ item, index })
      this.targetIndex = index
      this.targetIndexAnimatedValue.setValue(index)
      this.draggingStartScrollOffset = this.scrollOffset
      this.setState({ dragComponent, dragComponentStartIndex: index })
      this.createDraggableScaleAnimation(dragAnimationValue.dragging).start()
      this.trashModeAnimatedValue.setValue(trashModes.available)
    }
  }

  onItemPressOut = () => {
    if (!this.isDragging) {
      this.createDraggableScaleAnimation(dragAnimationValue.noDragging).start(this.resetState)
    }
  }

  resolveItemAnimationStyles = (inputRange, outputRange) => {
    return {
      transform: [
        {
          translateX: this.targetIndexAnimatedValue.interpolate({
            inputRange,
            outputRange,
            extrapolate: 'clamp',
          })
        }
      ]
    }
  }

  resolveItemStyles = (index) => {
    const { dragComponentStartIndex } = this.state
    if (dragComponentStartIndex === noDraggingIndex) return undefined
    const { cellSize } = this.props
    if (dragComponentStartIndex === index) {
      return { opacity: 0 }
    } else if (dragComponentStartIndex > index) {
      return this.resolveItemAnimationStyles([index, index + 1], [cellSize, 0])
    } else if (dragComponentStartIndex < index) {
      return this.resolveItemAnimationStyles([index - 1, index], [0, -cellSize])
    }
  }

  renderItem = ({ item, index }) => {
    const { renderItem } = this.props
    return (
      <Animated.View style={this.resolveItemStyles(index)}>
        {renderItem({ item, onLongPress: this.onItemLongPress(item, index), onPressOut: this.onItemPressOut })}
      </Animated.View>
    )
  }

  onListScroll = ({ nativeEvent }) => {
    this.scrollOffset = nativeEvent.contentOffset.x
  }

  onLayout = (event) => {
    const { width } = event.nativeEvent.layout
    this.setState({ containerWidth: width })
  }

  getItemLayout = (data, index) => {
    const { cellSize } = this.props
    return { length: cellSize, offset: cellSize * index, index }
  }

  resolveTrashStyles = () => {
    const { cellSize } = this.props
    const { hidden, available, active } = trashModes
    return {
      top: -cellSize,
      bottom: cellSize,
      opacity: this.trashModeAnimatedValue.interpolate({
        inputRange: [hidden, available, active],
        outputRange: [0, 0.5, 1],
      })
    }
  }

  render() {
    const { contentContainerStyle, items, keyExtractor } = this.props
    return (
      <View {...this.panResponder.panHandlers} onLayout={this.onLayout}>
        <Animated.View style={[s.trash, this.resolveTrashStyles()]}/>
        <FlatList
          ref={ref => this.flatList = ref}
          contentContainerStyle={contentContainerStyle}
          data={items}
          extraData={this.state}
          getItemLayout={this.getItemLayout}
          horizontal={true}
          keyExtractor={keyExtractor}
          onScroll={this.onListScroll}
          renderItem={this.renderItem}
          scrollEnabled={!this.state.dragComponent}
          showsHorizontalScrollIndicator={false}
        />
        {this.renderDragComponent()}
      </View>
    )
  }
}
