import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from '../screens/home'
import WriteScreen from '../screens/write'

export type RootParamList = {
  Home: undefined
  Write: { name: string; link?: string }
}

export type HomeProps = NativeStackScreenProps<RootParamList, 'Home'>
export type WriteProps = NativeStackScreenProps<RootParamList, 'Write'>

const Stack = createNativeStackNavigator<RootParamList>()

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Write"
        component={WriteScreen}
        options={{
          headerTitle: 'NFC',
        }}
      />
    </Stack.Navigator>
  )
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  )
}
