import express from 'express'
import bodyParser from 'body-parser'
import sqlite3 from 'sqlite3'
import { sequelize } from './models.js'
import { productRoutes  } from './routes/products.js'

const app = express()

// middlewares
app.use(bodyParser.json()) // lida com os formatos do body das requisições

app.use(productRoutes)

app.use((req, res, next) =>  {
  console.log('Atendendo outras ligações na linha, aguarde...')
  res.send({ mensagem: 'Bom dia! Qual o seu nome? Pronto para girar a roleta?' })
})

async function startApp() {
  const db = new sqlite3.Database('./tic.db', (err) => {
    if (err) {
      console.log('Error initializing your database', err)
      return
    }
    console.log('BD on!')
  })

  await sequelize.sync()
  
  const port = 3000
  const host = 'localhost'
  app.listen(port)
}

startApp()