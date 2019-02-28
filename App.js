import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import List from './List'
import { cellHeight } from "./ListItem"

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fbf',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 14,
    marginTop: 16,
    marginHorizontal: 8,
  },
})

export default class App extends React.Component {
  render() {
    return (
      <View style={s.container}>
        <Text style={s.title}>List with horizontal dragging and trash above it, fixed position extra item at the right</Text>
        <List
          canDeleteLast={false}
          extraItem={true}
          itemsCount={10}
          itemText="Short"
          itemWidth={cellHeight}
          reorderEnabled={true}
        />
        <Text style={s.title}>List with non-square items, only dragging to trash available</Text>
        <List
          canDeleteLast={true}
          extraItem={false}
          itemsCount={8}
          itemText="Long one"
          itemWidth={cellHeight * 1.5}
          reorderEnabled={false}
        />
      </View>
    )
  }
}
