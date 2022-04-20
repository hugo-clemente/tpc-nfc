import {
  SafeAreaView,
  StyleSheet,
  View,
  Text as RNText,
  Linking,
} from 'react-native'
import { Button, Input, Layout, Text } from '@ui-kitten/components'
import React from 'react'
import { HomeProps } from '../navigation/root-navigator'
import Logo from '../assets/tmp.svg'
import TPC from '../assets/tpc.svg'
import useStoredInput from '../utils/useStoredInput'
import { theme } from '../App'
import useKeyboardVisible from '../utils/useKeyboardVisible'

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    width: 200,
  },
  logo: {
    maxWidth: '50%',
    maxHeight: 100,
    marginTop: 50,
  },
  logoSubtitle: {
    marginTop: -10,
  },
  input: {
    width: '60%',
  },
  inputContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    paddingVertical: 10,
    width: '100%',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
  },
  footerLogo: {
    width: '100%',
    height: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  footerMail: {
    textAlign: 'center',
    color: theme['color-primary-500'],
    fontWeight: 'bold',
    fontSize: 15,
  },
})

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const isKeyboardVisible = useKeyboardVisible()
  const [name, nameProps] = useStoredInput('name')
  const [link, linkProps] = useStoredInput('link')

  const navigateWrite = () => {
    navigation.navigate('Write', {
      name,
      link,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Logo style={styles.logo} />
        <Text style={styles.logoSubtitle}>
          L'équipement de la route maîtrisée
        </Text>
        <Layout style={styles.inputContainer}>
          <Input label="Nom" {...nameProps} style={styles.input} />
          <Input label="Lien (optionnel)" {...linkProps} style={styles.input} />
          <Button
            onPress={navigateWrite}
            style={styles.button}
            disabled={!name}>
            Commencer
          </Button>
        </Layout>
        <Layout />
        <Layout
          level="2"
          style={{
            ...styles.footerContainer,
            display: isKeyboardVisible ? 'none' : undefined,
          }}>
          <Text style={styles.footerText}>Une application proposé par</Text>
          <TPC style={styles.footerLogo} />
          <Text style={styles.footerText}>Une question ? Un problème ?</Text>
          <RNText
            style={styles.footerMail}
            onPress={() => Linking.openURL('mailto:contact@tpc-toulouse.fr')}>
            contact@tpc-toulouse.fr
          </RNText>
        </Layout>
      </Layout>
    </SafeAreaView>
  )
}

export default HomeScreen
