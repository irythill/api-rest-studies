import http from 'http'
import fs from 'fs'
import routes from './routes.js'

fs.writeFile('./mensagem.txt', 'Olá, Henrique de novo arquivo ihu', 'utf-8', (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Arquivo criado com sucesso')
})

fs.readFile('./mensagem.txt', 'utf-8', (err, text) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Message: ${text}`)
  startServer(text)
})

function startServer(message) {
  const server = http.createServer((req, res) => {
    routes(req, res, { message })
  })
  
  const port = 3000;
  const host = 'localhost'
  server.listen(port, host, () => {
    console.log(`Server running at port ${port}, host ${host}`)
  })
}

