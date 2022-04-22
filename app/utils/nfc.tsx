import { useState } from 'react'
import NfcManager, { Ndef, NdefRecord, NfcTech } from 'react-native-nfc-manager'
import useLocation from './useLocation'
import moment from 'moment'
import 'moment/min/locales'

//! this code is not self explanatory, nor is it easy to understand, so i recommend you read the NTAG spec, which can be found in the readme

const password = [0x50, 0x58, 0x73, 0x74] // PXst
const pack = [0x4a, 0x41] // JA

type NTAG = '213' | '215' | '216'

async function checkType(): Promise<NTAG> {
  const respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0])
  const ccByte = respBytes[14]

  switch (ccByte) {
    case 0x12:
      return '213'

    case 0x3e:
      return '215'

    case 0x6d:
      return '216'

    default:
      throw new Error('Unsupported NTAG type')
  }
}

const getAuthPageIdx = (type: NTAG): number => {
  switch (type) {
    case '213':
      return 41

    case '215':
      return 131

    case '216':
      return 227
  }
}

/**
 * disable the tag's password protection
 * @returns true if the password was successfully removed, or if the tag was already unprotected, false otherwise
 */
async function unlockTag(): Promise<boolean> {
  let result = false
  try {
    await NfcManager.requestTechnology(NfcTech.NfcA)
    const type = await checkType()
    const authPageIdx = getAuthPageIdx(type)

    // reading auth config
    const respBytes = await NfcManager.nfcAHandler.transceive([
      0x30,
      authPageIdx,
    ])

    const auth = respBytes[3]

    if (auth !== 0xff) {
      // send password to NFC tags, so we can perform write operations
      const unlockRespBytes = await NfcManager.nfcAHandler.transceive([
        0x1b,
        ...password,
      ])

      if (unlockRespBytes[0] !== pack[0] || unlockRespBytes[1] !== pack[1]) {
        throw new Error('incorrect password')
      }

      // disable password protection
      await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx,
        respBytes[0],
        respBytes[1],
        respBytes[2],
        0xff,
      ])
    }

    result = true
  } catch (e) {
    console.error(e)
  } finally {
    NfcManager.cancelTechnologyRequest()
  }

  return result
}

/**
 * lock the tag with password protection
 * @returns true if the tag was successfully locked, false otherwise
 */
async function lockTag(): Promise<boolean> {
  let result = false
  try {
    await NfcManager.requestTechnology(NfcTech.NfcA)
    const type = await checkType()
    const authPageIdx = getAuthPageIdx(type)

    // getting config bytes
    const configBytes = await NfcManager.nfcAHandler.transceive([
      0x30,
      authPageIdx,
    ])

    // configure the tag to support password protection
    await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 3,
      ...pack,
      configBytes[14],
      configBytes[15],
    ])

    await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 2,
      ...password,
    ])

    // configure the tag to be read only without password, and without counter lock, or config lock
    await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 1,
      0xf,
      configBytes[5],
      configBytes[6],
      configBytes[7],
    ])

    // configure the tag so that everything except basics informations are password protected
    await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx,
      configBytes[0],
      configBytes[1],
      configBytes[2],
      4,
    ])

    result = true
  } catch (e) {
    console.error(e)
  } finally {
    NfcManager.cancelTechnologyRequest()
  }

  return result
}

interface MessageParameters {
  name: string
  link?: string
  location: { lat: number; lng: number }
}

function createMessage({ name, link, location }: MessageParameters): number[] {
  const localeDateString = moment().locale('fr').format('DD/MM/YY à HH:mm')

  const records: NdefRecord[] = []

  records.push(Ndef.textRecord(`Installé par ${name} le ${localeDateString}`))
  link && records.push(Ndef.uriRecord(link))
  records.push(
    Ndef.uriRecord(
      `geo:${location?.lat},${location?.lng}?q=${location?.lat},${location?.lng}`,
    ),
  )

  return Ndef.encodeMessage(records)
}

const writeTag = async (params: MessageParameters) => {
  let result = false
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef)

    const bytes = createMessage(params)

    await NfcManager.ndefHandler // STEP 2
      .writeNdefMessage(bytes) // STEP 3
    result = true
  } catch (e) {
    console.error(e)
  } finally {
    // STEP 4
    NfcManager.cancelTechnologyRequest()
  }
  return result
}

export const useLockTag = () => {
  const [locking, setLocking] = useState(false)

  const lockTagWrapper = async () => {
    setLocking(true)
    const result = await lockTag()
    setLocking(false)
    return result
  }

  return {
    locking,
    lockTag: lockTagWrapper,
  }
}

export const useUnlockTag = () => {
  const [unlocking, setUnlocking] = useState(false)

  const unlockTagWrapper = async () => {
    setUnlocking(true)
    const result = await unlockTag()
    setUnlocking(false)
    return result
  }

  return {
    unlocking: unlocking,
    unlockTag: unlockTagWrapper,
  }
}

export const useWriteTag = () => {
  const { location, initialized } = useLocation()
  const [writing, setWriting] = useState(false)

  const canWrite = location !== undefined

  const write = async (name: string, link?: string) => {
    let result = false
    setWriting(true)
    try {
      if (canWrite) {
        result = await writeTag({ name, link, location })
      } else {
      }
    } catch (e) {
      console.error(e)
    } finally {
      setWriting(false)
    }
    return result
  }

  return {
    canWrite,
    write,
    writing,
    initialized,
  }
}
