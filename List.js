import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import DraggableList from './DraggableList'
import ListItem from './ListItem'

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

  renderItem = ({ item }) => {
    return <ListItem item={item}/>
  }

  keyExtractor = (item, index) => {
    return `key-${index}`
  }

  render() {
    return (
      <View style={s.root}>
        <DraggableList
          contentContainerStyle={s.list}
          items={this.props.items}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
