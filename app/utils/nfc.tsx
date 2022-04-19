import { useState } from 'react'
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager'
import useLocation from './useLocation'
import moment from 'moment'
import 'moment/min/locales'

const writeNFC = async (
  name: string,
  link: string,
  location: { lat: number; lng: number },
) => {
  let result = false

  try {
    // STEP 1
    await NfcManager.requestTechnology(NfcTech.NfcA)

    const localeDateString = moment().locale('fr').format('HH:mm DD/MM/YY')

    console.log(localeDateString)

    const bytes = Ndef.encodeMessage([
      Ndef.textRecord(name),
      Ndef.uriRecord(link),
      Ndef.textRecord(localeDateString),
      Ndef.uriRecord(`geo:${location?.lat},${location?.lng}`),
    ])

    // if (bytes) {
    //   await NfcManager.ndefHandler // STEP 2
    //     .writeNdefMessage(bytes) // STEP 3
    //   result = true
    // }

    // Authing with password, resp should be equal to the pack
    // const resp = await NfcManager.nfcAHandler.transceive([
    //   0x1b, 0x12, 0x34, 0x56, 0x78,
    // ])

    const authPageIdx = 41

    const respBytes = await NfcManager.nfcAHandler.transceive([
      0x30,
      authPageIdx,
    ])
    // Authing with password
    await NfcManager.nfcAHandler.transceive([0x1b, 0x50, 0x58, 0x73, 0x74])
    // Setting AUTH0 value, defining protected range
    await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx,
      respBytes[0],
      respBytes[1],
      respBytes[2],
      0xff,
    ])

    // if (bytes) {
    //   // await NfcManager.requestTechnology(NfcTech.NfcA)
    //   // await ensurePasswordProtection()
    //   // await NfcManager.requestTechnology(NfcTech.Ndef)
    //   // await NfcManager.ndefHandler // STEP 2
    //   //   .writeNdefMessage(bytes) // STEP 3
    //   console.log(bytes.length)
    //   const bytesLength = Math.ceil(bytes.length / 4) * 4
    //   const fillArray = Array(bytesLength - bytes.length).fill(0)
    //   const filledArray = [...bytes, ...fillArray]
    //   // need to handle if over size
    //   const dataPageStart = 4
    //   for (let i = dataPageStart; i < bytesLength; i += 4) {
    //     const dataPage = filledArray.slice(i, i + 4)
    //     await NfcManager.nfcAHandler.transceive([
    //       dataPageStart + i / 4,
    //       ...dataPage,
    //     ])
    //   }
    // }

    result = true
  } catch (ex) {
    console.warn(typeof ex)
    console.warn(ex)
  } finally {
    // STEP 4
    NfcManager.cancelTechnologyRequest()
  }
  return result
}

export const useNfcWrite = () => {
  const location = useLocation()
  const [writing, setWriting] = useState(false)

  const canWrite = location !== undefined

  const write = async (name: string, link: string) => {
    setWriting(true)
    try {
      if (canWrite) {
        return await writeNFC(name, link, location)
      } else {
        return false
      }
    } catch (e) {
      console.error(e)
      return false
    } finally {
      setWriting(false)
    }
  }

  return {
    canWrite,
    write,
    writing,
  }
}
