import React from 'react'
import PropTypes from 'prop-types'
import { Animated, FlatList, PanResponder, StyleSheet, View } from 'react-native'

const s = StyleSheet.create({
  dragComponentContainer: {
    backgroundColor: 'rgba(255,0,0,0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
})

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
    this.state = {
      dragComponent: undefined,
    }
    this.dragging = false
    this.dragStart = new Animated.Value(0)
    this.dragMove = new Animated.Value(0)
    this.drag = Animated.add(this.dragStart, this.dragMove)
    this.panResponder = this.createPanResponder(props.cellSize)
  }

  createPanResponder = (cellSize) => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: (event) => {
        const { pageX } = event.nativeEvent
        this.dragStart.setValue(pageX - pageX % cellSize)
        return false
      },
      onMoveShouldSetPanResponder: () => {
        this.dragging = !!this.state.dragComponent
        return this.dragging
      },
      onPanResponderMove: (event, gestureState) => {
        const { dx } = gestureState
        this.dragMove.setValue(dx)
      },
      onPanResponderRelease: () => {
        this.setState({ dragComponent: undefined })
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

  onItemLongPress = (item) => {
    return () => {
      const dragComponent = this.renderItem({ item })
      this.setState({ dragComponent })
    }
  }

  onItemPressOut = () => {
    if (!this.dragging) this.setState({ dragComponent: undefined })
  }

  renderItem = ({ item }) => {
    const { renderItem } = this.props
    return renderItem({ item, onLongPress: this.onItemLongPress(item), onPressOut: this.onItemPressOut })
  }

  render() {
    const { contentContainerStyle, items, keyExtractor } = this.props
    return (
      <View {...this.panResponder.panHandlers}>
        <FlatList
          contentContainerStyle={contentContainerStyle}
          data={items}
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
