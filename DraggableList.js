import React from 'react'
import PropTypes from 'prop-types'
import { Animated, Easing, FlatList, PanResponder, StyleSheet, View } from 'react-native'

const s = StyleSheet.create({
  dragComponentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})

const scaleDuration = 100
const swapDuration = 300

const scrollMargin = 50
const scrollPixels = 20

const noDraggingIndex = -1
const defaultDragState = {
  dragComponent: undefined,
  dragComponentStartIndex: noDraggingIndex,
}

const notDragging = 0
const dragging = 1

export default class DraggableList extends React.PureComponent {
  static propTypes = {
    cellSize: PropTypes.number.isRequired,
    contentContainerStyle: PropTypes.object,
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
    this.dragging = false
    this.draggingAnimation = new Animated.Value(notDragging)
    this.dragStartComponentLeft = 0
    this.dragStart = new Animated.Value(0)
    this.dragMove = new Animated.Value(0)
    this.drag = Animated.add(this.dragStart, this.dragMove)
    this.targetIndex = -2
    this.targetIndexAnimation = new Animated.Value(this.targetIndex)
    this.panResponder = this.createPanResponder(props.cellSize)
  }

  createPanResponder = (cellSize) => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: (event) => {
        const { pageX } = event.nativeEvent
        this.dragStartComponentLeft = pageX - (pageX + this.scrollOffset) % cellSize
        this.dragStart.setValue(this.dragStartComponentLeft)
        return false
      },
      onMoveShouldSetPanResponder: () => {
        this.dragging = !!this.state.dragComponent
        return this.dragging
      },
      onPanResponderMove: (event, gestureState) => {
        const { cellSize } = this.props
        const { pageX } = event.nativeEvent
        const { dx } = gestureState
        this.dragMove.setValue(dx)
        const dragStartComponentMiddle = this.scrollOffset + this.dragStartComponentLeft + cellSize / 2
        const targetIndex = Math.floor((dragStartComponentMiddle + dx) / cellSize)
        if (targetIndex !== this.targetIndex) {
          this.animateSwap(targetIndex)
          this.targetIndex = targetIndex
        }
        this.scrollOnEdge(pageX, targetIndex)
      },
      onPanResponderRelease: (event, gestureState) => {
        const { dragComponentStartIndex } = this.state
        const moved = this.targetIndex - this.state.dragComponentStartIndex
        const scrolledDuringDragging = this.scrollOffset - this.draggingStartScrollOffset
        const targetX = moved * this.props.cellSize - scrolledDuringDragging
        Animated.parallel([
          this.createDraggableScaleAnimation(notDragging),
          this.createDropAnimation(targetX)
        ]).start(() => {
          if (moved !== 0) {
            this.props.onReorder(this.reorderItems(dragComponentStartIndex, this.targetIndex))
          }
          this.resetState()
        })
      },
    })
  }

  animateSwap = (targetIndex) => {
    Animated.timing(this.targetIndexAnimation, {
      toValue: targetIndex,
      duration: swapDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start()
  }

  createDropAnimation = (targetX) => {
    return Animated.timing(this.dragMove, {
      toValue: targetX,
      duration: scaleDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  }

  scrollOnEdge = (pageX, targetIndex) => {
    if (targetIndex <= 0) return
    if (targetIndex >= this.props.items.length) return this.flatList.scrollToEnd()
    let newScrollOffset = 0
    if (pageX < scrollMargin) {
      newScrollOffset = Math.max(0, this.scrollOffset - scrollPixels)
    } else if (pageX > this.state.containerWidth - scrollMargin) {
      newScrollOffset = this.scrollOffset + scrollPixels
    }
    if (newScrollOffset) {
      this.flatList.scrollToOffset({ offset: newScrollOffset })
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
    this.targetIndexAnimation.setValue(this.targetIndex)
    this.dragging = false
    this.dragMove.setValue(0)
    this.setState(defaultDragState)
  }

  resolveDragComponentContainerStyles = () => {
    return [
      s.dragComponentContainer,
      {
        transform: [
          { translateX: this.drag },
          {
            scale: this.draggingAnimation.interpolate({
              inputRange: [notDragging, dragging],
              outputRange: [1, 1.125],
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

  createDraggableScaleAnimation = (toValue, onFinish) => {
    return Animated.timing(this.draggingAnimation, {
      toValue,
      duration: scaleDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  }

  onItemLongPress = (item, index) => {
    return () => {
      const dragComponent = this.props.renderItem({ item, index })
      this.targetIndex = index
      this.targetIndexAnimation.setValue(index)
      this.draggingStartScrollOffset = this.scrollOffset
      this.setState({ dragComponent, dragComponentStartIndex: index })
      this.createDraggableScaleAnimation(dragging).start()
    }
  }

  onItemPressOut = () => {
    if (!this.dragging) {
      this.createDraggableScaleAnimation(notDragging).start(this.resetState)
    }
  }

  resolveItemAnimationStyles = (inputRange, outputRange) => {
    return {
      transform: [
        {
          translateX: this.targetIndexAnimation.interpolate({
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

  render() {
    const { contentContainerStyle, items, keyExtractor } = this.props
    return (
      <View {...this.panResponder.panHandlers} onLayout={this.onLayout}>
        <FlatList
          ref={ref => this.flatList = ref}
          contentContainerStyle={contentContainerStyle}
          data={items}
          extraData={this.state}
          getItemLayout={this.getItemLayout}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
          onScroll={this.onListScroll}
          scrollEnabled={!this.state.dragComponent}
          showsHorizontalScrollIndicator={false}
        />
        {this.renderDragComponent()}
      </View>
    )
  }
}
