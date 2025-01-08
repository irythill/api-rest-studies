import express from 'express'
import { 
  sequelize, 
  createProduct, 
  readProducts, 
  readProductById, 
  updateProductById, 
  deleteProductById } from '../models.js'

export const productRoutes = express.Router() 

// CREATE PRODUCT
productRoutes.post('/products', async (req, res, next) => {
    const product = req.body

    res.statusCode = 400

    if (!product?.name) {
      const response = {
        err: {
          message: 'Name is required to create this product',
        },
      }
      res.send(response)
      return
    }

    if (!product?.price) {
      const response = {
        err: {
          message: 'Price is required to create this product',
        },
      }
      res.send(response)
      return
    }

    try {
      const response = await createProduct(product)
      res.statusCode = 201 // success
      res.send(response)
      return
      
    } catch (err){
      console.log('Error creating product', err)
      res.statusCode = 500

      const response = {
        err: {
          message: `Error creating product ${product.name}`
        }
      }
      res.send(response)
      return
    }
  
})

// UPDATE PRODUCT
productRoutes.patch('/products/:id', async (req, res, next) => {
  const product = req.body
      res.statusCode = 400

      if (!product?.name && !product?.price) {
        const response = {
          err: {
            message: 'Name or price is required to update this product',
          },
        }
        res.send(response)
        return
      }

      const id = req.params.id

      try {
        const response = await updateProductById(id, product)
        res.statusCode = 200

        if (!response) {
          res.statusCode = 404;
        }

        res.send(response)
        return

      } catch {
        console.log('Couldnt access the product', err)
        res.statusCode = err.code === 'ENOENT' ? 404 : 500
          
        const response = {
          err: {
            message: `Failed to access the product ${id}`,
          }
        }
        res.send(response)
        return
      }
})

// DELETE PRODUCT
productRoutes.delete('/products/:id', async (req, res, next) => {
  const id = req.params.id

    try {
      const response = await deleteProductById(id)
      res.statusCode = 204

      if (!response) {
        res.statusCode = 404
      }

      res.send()
      return

    } catch {
      console.log(err)
      res.statusCode = 500

      const response = {
        err: {
          message: `Error while deleting the product ${id}`
        }
      }
      res.send(response)
      return
    }
})

// GET PRODUCT BY ID
productRoutes.get('/products/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    const response = await readProductById(id)
    if (!response) {
      res.statusCode = 404
    }

    res.statusCode = 200
    res.send()
    return

  } catch {
    console.log(err)
    res.statusCode = 500

    const response = {
      err: {
        message: `Error while searching the product ${id}`
      }
    }
    res.send(response)
    return
  }
})

// GET ALL PRODUCTS
productRoutes.get('/products', async (req, res, next) => {
  try {
    const response = await readProducts()
    res.statusCode = 200
    res.send(response)
    return

  } catch {
    console.log(err)
    res.statusCode = 500

    const response = {
      err: {
        message: `Error while searching all the products`
      }
    }
    res.end(response)
    return
  }
})