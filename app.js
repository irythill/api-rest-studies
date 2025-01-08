import http from 'http'
import sqlite3 from 'sqlite3'
import { sequelize, createOrder, readOrders } from './models.js'
import routes from './routes.js'

const db = new sqlite3.Database('./tic.db', (err) => {
  if (err) {
    console.log('Error initializing your database', err)
    return
  }
  console.log('BD on!')
})

async function startServer(message) {
  await sequelize.sync()

  await createOrder({ totalPrice: 13.00, products: [ { id: 1, quantity: 1, price: 5 } ] })
  await readOrders()

  const server = http.createServer((req, res) => {
    routes(req, res, { message })
  })
  
  const port = 3000
  const host = 'localhost'
  server.listen(port, host, () => {
    console.log(`Server running at port ${port}, host ${host}`)
  })
}

startServer()
 
