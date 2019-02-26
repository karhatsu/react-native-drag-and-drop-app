import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import List from './List'

const itemsCount = 10

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
  constructor(props) {
    super(props)
    this.state = {
      items: this.initItems(),
    }
  }

  reorderItems = items => {
    this.setState({ items })
  }

  deleteItem = index => {
    const { items } = this.state
    items.splice(index, 1)
    this.setState({ items })
  }

  render() {
    return (
      <View style={s.container}>
        <Button onPress={this.resetData} title="Reset data"/>
        <Text style={s.text}>Text above the list</Text>
        <List deleteItem={this.deleteItem} items={this.state.items} onReorder={this.reorderItems}/>
      </View>
    )
  }

  resetData = () => {
    this.setState({ items: this.initItems() })
  }

  initItems = () => {
    const items = []
    for (let i = 0; i < itemsCount; i++) {
      items.push({ id: i, text: `Hello ${i}` })
    }
    return items
  }
}
