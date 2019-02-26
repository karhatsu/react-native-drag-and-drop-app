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
        <List itemsCount={20} itemText="Long one" itemWidth={cellHeight * 1.5}/>
        <Text style={s.text}>Text above the list</Text>
        <List itemsCount={10} itemText="Short" itemWidth={cellHeight}/>
      </View>
    )
  }
}
