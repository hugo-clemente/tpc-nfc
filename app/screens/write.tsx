import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native'
import { Button, Layout, Text } from '@ui-kitten/components'
import React, { useMemo, useRef } from 'react'
import { WriteProps } from '../navigation/root-navigator'
import { useLockTag, useUnlockTag, useWriteTag } from '../utils/nfc'
import LottieView from 'lottie-react-native'

const WriteScreen: React.FC<WriteProps> = ({ route }) => {
  const { unlockTag, unlocking } = useUnlockTag()
  const { lockTag, locking } = useLockTag()
  const { canWrite, write, writing, initialized } = useWriteTag()

  const successLottieRef = useRef<LottieView>(null)
  const failureLottieRef = useRef<LottieView>(null)

  const wrapper = async (func: () => Promise<boolean>) => {
    successLottieRef.current?.reset()
    failureLottieRef.current?.reset()
    const res = await func()
    if (!res) {
      ToastAndroid.show(
        'Une erreur est survenue, réessayez',
        ToastAndroid.SHORT,
      )
      failureLottieRef.current?.play()
    } else {
      successLottieRef.current?.play()
    }
  }

  const reset = (ref: React.RefObject<LottieView>) => {
    // setTimeout(() => ref.current?.reset(), 2500)
  }

  const processing = useMemo(
    () => writing || locking || unlocking,
    [locking, unlocking, writing],
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <View style={styles.lottieContainer}>
          {processing && (
            <LottieView
              style={styles.lottie}
              source={require('../assets/animation/nfc.json')}
              autoPlay
              loop
              speed={1.2}
            />
          )}
          <LottieView
            ref={successLottieRef}
            style={styles.lottie}
            source={require('../assets/animation/success.json')}
            speed={1.2}
            loop={false}
            onAnimationFinish={() => reset(successLottieRef)}
          />
          <LottieView
            ref={failureLottieRef}
            style={styles.lottie}
            source={require('../assets/animation/failure.json')}
            speed={1.2}
            loop={false}
            onAnimationFinish={() => reset(failureLottieRef)}
          />
        </View>
        <View>
          <Button
            style={styles.button}
            onPress={() => wrapper(unlockTag)}
            disabled={processing}>
            {unlocking ? <ActivityIndicator /> : <Text>Déverrouiller</Text>}
          </Button>
          <Button
            style={styles.button}
            onPress={() =>
              wrapper(() => write(route.params.name, route.params.link))
            }
            disabled={!canWrite || processing || !initialized}>
            {writing || !initialized ? (
              <ActivityIndicator />
            ) : (
              <Text>Écrire</Text>
            )}
          </Button>
          <Button
            style={styles.button}
            onPress={() => wrapper(lockTag)}
            disabled={processing}>
            {locking ? <ActivityIndicator /> : <Text>Verrouiller</Text>}
          </Button>
        </View>
      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  lottieContainer: {
    flexGrow: 1,
    width: '100%',
  },
  lottie: {},
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  button: {
    marginVertical: 4,
    marginHorizontal: 20,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default WriteScreen
