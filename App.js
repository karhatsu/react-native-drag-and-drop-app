import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { ScreenOrientation } from 'expo'
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
      landscape: false,
    }
  }

  reorderItems = items => {
    this.setState({ items })
  }

  render() {
    const buttonTitle = this.state.landscape ? 'Portrait' : 'Landscape'
    return (
      <View style={s.container}>
        <Button onPress={this.resetData} title="Reset data"/>
        <Button onPress={this.rotate} title={buttonTitle}/>
        <Text style={s.text}>Text above the list</Text>
        <List items={this.state.items} onReorder={this.reorderItems}/>
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

  rotate = () => {
    const { landscape } = this.state
    const orientation = landscape ? ScreenOrientation.Orientation.PORTRAIT : ScreenOrientation.Orientation.LANDSCAPE
    ScreenOrientation.allowAsync(orientation)
    this.setState({ landscape: !landscape })
  }
}
