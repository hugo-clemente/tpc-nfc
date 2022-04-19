import React from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider } from '@ui-kitten/components'
import { lightTheme } from './theme/light'
import { RootNavigator } from './navigation/root-navigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

export default () => (
  <ApplicationProvider {...eva} theme={lightTheme}>
    <SafeAreaProvider>
      <StatusBar backgroundColor={lightTheme['color-primary-500']} />
      <RootNavigator />
    </SafeAreaProvider>
  </ApplicationProvider>
)
