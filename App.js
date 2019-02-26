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
  text: {
    marginTop: 100,
  },
})

export default class App extends React.Component {
  render() {
    return (
      <View style={s.container}>
        <List
          canDeleteLast={true}
          extraItem={false}
          itemsCount={20}
          itemText="Long one"
          itemWidth={cellHeight * 1.5}
          reorderEnabled={false}
        />
        <Text style={s.text}>Text above the list</Text>
        <List
          canDeleteLast={false}
          extraItem={true}
          itemsCount={10}
          itemText="Short"
          itemWidth={cellHeight}
          reorderEnabled={true}
        />
      </View>
    )
  }
}
