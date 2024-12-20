import http from 'http'
import sqlite3 from 'sqlite3'
import { sequelize, createProduct, readProducts, readProductById, updateProductById, deleteProductById } from './models.js'
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
  await createProduct({ name: 'Açaí puro', price: 10.50 })
  await createProduct({ name: 'Açaí c/ morango', price: 15.00 })
  await readProducts()
  await readProductById(1)
  await readProductById(30)
  await updateProductById(1, { price: 55 })
  await readProductById(1)
  await deleteProductById(1)
  await readProductById(1)

  const server = http.createServer((req, res) => {
    routes(req, res, { message })
  })
  
  const port = 3000
  const host = 'localhost'
  server.listen(port, host, () => {
    console.log(`Server running at port ${port}, host ${host}`)
  })
}

