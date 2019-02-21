import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, View } from 'react-native'

export default class DraggableList extends React.PureComponent {
  static propTypes = {
    contentContainerStyle: PropTypes.object,
    items: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
  }

  render() {
    const { contentContainerStyle, items, keyExtractor, renderItem } = this.props
    return (
      <View>
        <FlatList
          contentContainerStyle={contentContainerStyle}
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
        />
      </View>
    )
  }
}
