import { useState, useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

async function requestPermission() {
  // needs a modal here
  const granted = await PermissionsAndroid.request(
    'android.permission.ACCESS_FINE_LOCATION',
  )

  if (granted === 'denied') requestPermission()
  if (granted === 'never_ask_again')
    throw Error("Il faut réinstaller l'application") //TODO
}

export default () => {
  const [location, setLocation] = useState<
    { lat: number; lng: number } | undefined
  >(undefined)

  useEffect(() => {
    let watchId: number | undefined
    ;(async () => {
      try {
        await requestPermission()
        // await requestPermission()
        watchId = Geolocation.watchPosition(
          position => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          error => {
            /**
             * PERMISSION_DENIED					1	Location permission is not granted
             * POSITION_UNAVAILABLE				2	Location provider not available
             * TIMEOUT										3	Location request timed out
             * PLAY_SERVICE_NOT_AVAILABLE	4	Google play service is not installed or has an older version (android only)
             * SETTINGS_NOT_SATISFIED			5	Location service is not enabled or location mode is not appropriate for the current request (android only)
             * INTERNAL_ERROR						 -1	Library crashed for some reason or the getCurrentActivity() returned null (android only)
             */
            console.log(error.code, error.message)
          },
          {
            enableHighAccuracy: true,
            interval: 5000 /* 5 sec */,
            fastestInterval: 2000 /* 2 sec */,
          },
        )
      } catch (e) {
        console.error(e)
      }
    })()

    return () => {
      if (watchId !== undefined) Geolocation.clearWatch(watchId)
    }
  }, [])

  return location
}
