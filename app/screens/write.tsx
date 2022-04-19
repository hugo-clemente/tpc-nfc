import { SafeAreaView } from 'react-native'
import { Button, Layout, Spinner } from '@ui-kitten/components'
import React from 'react'
import { WriteProps } from '../navigation/root-navigator'
import { useNfcWrite } from '../utils/nfc'

const WriteScreen: React.FC<WriteProps> = ({ route }) => {
  const { canWrite, write, writing } = useNfcWrite()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Spinner style={{ opacity: writing ? 100 : 0 }} />
        <Button
          onPress={() => write(route.params.name, route.params.link)}
          disabled={!canWrite || writing}>
          Commencer
        </Button>
      </Layout>
    </SafeAreaView>
  )
}

export default WriteScreen
