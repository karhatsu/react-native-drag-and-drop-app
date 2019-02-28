# React Native Drag & Drop Example App

## Description

This is a simple app that demonstrates how drag and drop can be implemented with [React Native](https://facebook.github.io/react-native). This means that you cannot use it as a library in your own app but you may get some ideas for your own implementation.

Feel free to clone the code and implement your own solution based on that.

## Usage

Install [Expo](https://expo.io/) to your phone, connect it to your computer, then run:

```
yarn install
yarn run start
```

## Features

* Horizontal dragging and dropping.
* Automatic scrolling while dragging.
* Deleting an item by dragging it on top of the list.
* An extra item at the end of the list with a fixed position.
* No experimental React Native's [LayoutAnimation](https://facebook.github.io/react-native/docs/layoutanimation) used.

## Limitations

* This supports only horizontal scrolling. Vertical scrolling wouldn't be however a hard thing to do. Basically change the `FlatList`'s `horizontal` prop and switch `x` and `y` in the `DraggableList` component.
* The items need to have a fixed width (height if translated to vertical list). This simplifies dragging a lot as we can very easily calculate the target position of the draggable element.
