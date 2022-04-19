import { SafeAreaView, StyleSheet } from 'react-native'
import { Button, Input, Layout } from '@ui-kitten/components'
import React from 'react'
import { HomeProps } from '../navigation/root-navigator'
import Logo from '../assets/tpc.svg'
import useStoredInput from '../utils/useStoredInput'

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
  },
  logo: {
    maxWidth: '50%',
    maxHeight: 100,
  },
  input: {
    width: '60%',
  },
})

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
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
        <Input label="Nom" {...nameProps} style={styles.input} />
        <Input label="Lien" {...linkProps} style={styles.input} />
        {/* <Button appearance="outline" onPress={navigateRead} style={styles.button}>
          READ
        </Button> */}
        <Button onPress={navigateWrite} style={styles.button}>
          Écrire
        </Button>
      </Layout>
    </SafeAreaView>
  )
}

export default HomeScreen
