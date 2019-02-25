import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
    let items = []
    for (let i = 0; i < itemsCount; i++) {
      items.push({ id: i, text: `Hello ${i}` })
    }
    this.state = {
      items
    }
  }

  reorderItems = items => {
    this.setState({ items })
  }

  render() {
    return (
      <View style={s.container}>
        <Text style={s.text}>Text above the list</Text>
        <List items={this.state.items} onReorder={this.reorderItems}/>
      </View>
    )
  }
}
