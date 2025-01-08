import { 
  sequelize, 
  createProduct, 
  readProducts, 
  readProductById, 
  updateProductById, 
  deleteProductById } from './models.js'

export default async function routes(req, res, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  // GET
  if(req.method === 'GET' && req.url === '/') {
    const { message } = data

    res.statusCode = 200
    const response = {
      message: message,
    }
    res.end(JSON.stringify(response))
    return
  }

  // POST
  if(req.method === 'POST' && req.url === '/products'){
    const body = []
    req.on('data', (part) => {
      body.push(part)
    })

    req.on('end', async () => {
      const product = JSON.parse(body)
      res.statusCode = 400

      if (!product?.name) {
        const response = {
          err: {
            message: 'Name is required to create this product',
          },
        }
        res.end(JSON.stringify(response))
        return
      }

      if (!product?.price) {
        const response = {
          err: {
            message: 'Price is required to create this product',
          },
        }
        res.end(JSON.stringify(response))
        return
      }

      try {
        const response = await createProduct(product)
        res.statusCode = 201 // success
        res.end(JSON.stringify(response))
        return
        
      } catch (err){
        console.log('Error creating product', err)
        res.statusCode = 500

        const response = {
          err: {
            message: `Error creating product ${product.name}`
          }
        }
        res.end(JSON.stringify(response))
        return
      }
    })

    req.on('error', (err) => {
      console.log('Failed to process your requisition', err)
      res.statusCode = 400

      const response = {
        err: {
          message: 'Failed to process your requisition'
        }
      }
      res.end(JSON.stringify(response))
      return
    })
    return
  }

  // PATCH
  if(req.method === 'PATCH' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])){
    const body = []
    
    req.on('data', (part) => {
      body.push(part)
    })

    req.on('end', async () => {
      const product = JSON.parse(body)
      res.statusCode = 400

      if (!product?.name && !product?.price) {
        const response = {
          err: {
            message: 'Name or price is required to update this product',
          },
        }
        res.end(JSON.stringify(response))
        return
      }

      const id = req.url.split('/')[2]

      try {
        const response = await updateProductById(id, product)
        res.statusCode = 200
        res.end(JSON.stringify(response))
        return

      } catch {
        console.log('Couldnt access the product', err)
        res.statusCode = err.code === 'ENOENT' ? 404 : 500
          
        const response = {
          err: {
            message: `Failed to access the product ${product.name}`,
          }
        }
        res.end(JSON.stringify(response))
        return
      }
    })

    req.on('error', (err) => {
      console.log('Failed to process your requisition', err)
      res.statusCode = 400

      const response = {
        err: {
          message: 'Failed to process your requisition'
        }
      }
      res.end(JSON.stringify(response))
      return
    })
    return
  }

  // DELETE
  if(req.method === 'DELETE' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])){
    const id = req.url.split('/')[2]

    try {
      const response = await deleteProductById(id)
      res.statusCode = 204
      res.end()
      return

    } catch {
      console.log(err)
      res.statusCode = 500

      const response = {
        err: {
          message: `Error while deleting the product ${id}`
        }
      }
      res.end(JSON.stringify(response))
      return
    }
  
  }

  // GET (READ PRODUCTS)
  if(req.method === 'GET' && req.url === '/products'){
    try {
      const response = await readProducts()
      res.statusCode = 200
      res.end(JSON.stringify(response))
      return

    } catch {
      console.log(err)
      res.statusCode = 500

      const response = {
        err: {
          message: `Error while searching all the products`
        }
      }
      res.end(JSON.stringify(response))
      return
    }
  }
  

 // GET (READ PRODUCT BY ID)
  if(req.method === 'GET' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])){
    const id = req.url.split('/')[2]

    try {
      const response = await readProductById(id)
      res.statusCode = 200
      res.end(JSON.stringify(response))
      return

    } catch {
      console.log(err)
      res.statusCode = 500

      const response = {
        err: {
          message: `Error while searching the product ${id}`
        }
      }
      res.end(JSON.stringify(response))
      return
    }
  }

  res.statusCode = 404
  const response = {
    err: {
      message: 'Not found',
      url: req.url
    }
  }
  res.end(JSON.stringify(response))
  return
}