import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DraggableList from './DraggableList'

const itemsCount = 10

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
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
    let items = []
    for (let i = 0; i < itemsCount; i++) {
      items.push(`Hello ${i}`)
    }
    return (
      <View style={s.container}>
        <Text style={s.text}>Text above</Text>
        <DraggableList style={s.list} items={items}/>
      </View>
    )
  }
}
