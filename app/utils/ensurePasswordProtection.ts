import NfcManager from 'react-native-nfc-manager'

const password = [0x50, 0x58, 0x73, 0x74] // PXst
const pack = [0x4a, 0x41] // JA

// this code is not self explanatory, nor is it easy to understand, so i recommend you read the NTAG spec, which can be found in the readme
async function ensurePasswordProtection() {
  let respBytes = null
  let writeRespBytes = null
  let authPageIdx

  // check if this is NTAG 213 or NTAG 215 or NTAG 216
  respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0])
  const ccByte = respBytes[14]
  switch (ccByte) {
    case 0x12:
      authPageIdx = 41 // NTAG 213
      break

    case 0x3e:
      authPageIdx = 131 // NTAG 215
      break

    case 0x6d:
      authPageIdx = 227 // NTAG 216
      break

    default:
      throw new Error('Unsupported NTAG type')
  }

  // check if AUTH is enabled
  respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx])
  const auth = respBytes[3]

  if (auth === 0xff) {
    // configure the tag to support password protection
    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 3,
      ...pack,
      respBytes[14],
      respBytes[15],
    ])

    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 2,
      ...password,
    ])

    // configure the tag to be read only without password, and without counter lock, or config lock
    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 1,
      0xf,
      respBytes[5],
      respBytes[6],
      respBytes[7],
    ])

    // configure the tag so that everything except basics informations are password protected
    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx,
      respBytes[0],
      respBytes[1],
      respBytes[2],
      4,
    ])
  } else {
    // send password to NFC tags, so we can perform write operations
    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0x1b,
      ...password,
    ])

    if (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1]) {
      throw new Error('incorrect password')
    }
  }
}

export default ensurePasswordProtection
