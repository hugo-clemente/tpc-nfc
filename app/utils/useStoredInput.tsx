import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

export default function (
  name: string,
): [string, { value: string; onChangeText: (value: string) => void }] {
  const [value, setValue] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const storedValue = await AsyncStorage.getItem(name)
        if (storedValue !== null) {
          setValue(storedValue)
        }
      } catch (e) {
        // error reading value
      }
    })()
  }, [name])

  const onChangeText = (newValue: string) => {
    setValue(newValue)
    AsyncStorage.setItem(name, newValue)
  }

  return [
    value,
    {
      value,
      onChangeText,
    },
  ]
}
