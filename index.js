/* eslint-disable no-undef */
// 1

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )
const myHeaders = new Headers()
myHeaders.append('Authorization', 'Bearer 6|4kkdnsOqo3fZzcgqdatCnteTaJSjCkvZNWAanfHp')
myHeaders.append('Content-Type', 'application/json')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const upload = (items) => {
  const body = JSON.stringify(items)
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: body,
    redirect: 'follow'
  }
  return fetch('https://vulpecula.aimservices.tech/api/analytics', requestOptions)
    .then(response => response.json())
}
const getCommonData = () => {
  return {
    source: localStorage.getItem('source'),
    env: localStorage.getItem('env'),
    app_client: localStorage.getItem('app_client'),
    app_home_layout: self.kioskConfig.HOME_LAYOUT
  }
}

// copiar lo que debuelva la consola
console.log('SCRIPT LOADED')

export const uploadEvents = ()=>
{
  const script1 = document.createElement('script')
  script1.src = 'https://unpkg.com/dexie/dist/dexie.js'
  document.body.appendChild(script1)

  //2
  const theDBName = 'analitics_Events'
  let theDB = new Dexie(theDBName)
  let {verno, tables} = await theDB.open()
  theDB.close()
  theDB = new Dexie(theDBName)
  theDB.version(verno).stores(tables.reduce((p, c) => { p[c.name] = c.schema.primKey.keyPath || ''; return p }, {}))
  const items = await theDB.events.toArray()
  console.log('UPLOADER: ', items)
  //  4 GET CHUNKS
  const commontData = getCommonData()
  const chunks = chunk(items.map(item => ({
    ...item,
    ...commontData,
    account_id: 1
  })), 50)
  console.log('UPLOADER: chunks', chunks)


  for (let index = 0; index < chunks.length; index++) {
    try {
      const currentChunk = chunks[index]
      const response = await upload(currentChunk)
      if (response.success === true) {
        const removed = await theDB.events.where('id').between(currentChunk[0].id, currentChunk[currentChunk.length - 1].id, true, true).delete()
        console.log(`UPLOADER: chunk ${index + 1} ${new Date()}  uploaded, removed ${removed}`, response)
        await sleep(1000)
      } else {
        throw new Exception('Error events could not be uploaded')
      }
    } catch (e) {
      console.error(`UPLOADER: error on chunk  ${index + 1}`, e)
      break
    }
  }

  console.log('UPLOADER: upload ended')
}

window.addEventListener('load', async () => {
  uploadEvents()
})

self.uploadEvents = uploadEvents