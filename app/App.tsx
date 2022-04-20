import React from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider } from '@ui-kitten/components'
import { tpcTheme } from './theme/tpc'
import { RootNavigator } from './navigation/root-navigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import { tmpTheme } from './theme/tmp'

export const theme = tmpTheme

export default () => (
  <ApplicationProvider {...eva} theme={theme}>
    <SafeAreaProvider>
      <StatusBar backgroundColor={theme['color-primary-500']} />
      <RootNavigator />
    </SafeAreaProvider>
  </ApplicationProvider>
)
