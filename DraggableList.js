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
    this.dragAnimation = new Animated.Value(0)
    this.panResponder = this.createPanResponder(props.cellSize)
  }

  createPanResponder = (cellSize) => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: (event) => {
        const { pageX } = event.nativeEvent
        this.dragAnimation.setValue(pageX - pageX % cellSize)
      }
    })
  }

  resolveDragComponentContainerStyles = () => {
    return [
      s.dragComponentContainer,
      { transform: [{ translateX: this.dragAnimation }] }
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

  renderItem = ({ item }) => {
    const { renderItem } = this.props
    return renderItem({ item, onLongPress: this.onItemLongPress(item) })
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
        />
        {this.renderDragComponent()}
      </View>
    )
  }
}
