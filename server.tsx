import React, { Suspense } from 'react'
import http from 'http'
import { renderToStream } from './src/server'
import { useAsync } from './src/server/useAsync'

const delay = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 3000);
  })
}

const Page = () => {
  const val = useAsync(
    'hello-component-key-2',
    () =>
      new Promise<string>((resolve) => {
        setTimeout(() => {
          return resolve(
            'Hello, I was lazy sync 2 ssr'
          )
        }, 2000)
      }),
  )
  return (
    <div>{val}</div>
  )
}

const App = () => {
  return (
    <html>
      <head>
        <title>Streaming App</title>
      </head>
      <body>
        <div id="root">
          hello
          <Suspense>
            <Page />
          </Suspense>
        </div>
      </body>
    </html>
  )
}

const app = http.createServer(async (req, res) => {
  console.log(req.url)
  // res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Content-type', 'text/html')
  const { pipe, streamEnd } = await renderToStream(<App />, {
    onBoundaryError(err) {
      console.error(err)
    },
    disable: false,
    webStream: false
  })
  pipe?.(res)
  await streamEnd
  res.end()
})

app.listen(8080, () => {
  console.log('Server start at 8080')
})

