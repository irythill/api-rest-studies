import http from 'http'
import fs from 'fs'
import sqlite3 from 'sqlite3'
import { sequelize } from './models.js'
import routes from './routes.js'

const db = new sqlite3.Database('./tic.db', (err) => {
  if (err) {
    console.log('Error initializing your database', err)
    return
  }
  console.log('BD on!')
})

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

async function startServer(message) {
  await sequelize.sync()
  
  const server = http.createServer((req, res) => {
    routes(req, res, { message })
  })
  
  const port = 3000
  const host = 'localhost'
  server.listen(port, host, () => {
    console.log(`Server running at port ${port}, host ${host}`)
  })
}

