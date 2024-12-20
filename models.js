import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './tic.db'
})

sequelize.authenticate()

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

async function createProduct(product) {
  try {
    await Product.create(product)
    console.log(`The product ${product.nome} was succesfully created!`)
  } catch (err) {
    console.log('Fail to create product', err)
  }
  
}

async function readProducts() {
  try {
    const result = await Product.findAll()
    console.log(`Products found with success!`, result)
  } catch (err) {
    console.log('Fail to find all products', err)
  }
}

async function readProductById(id) {
  try {
    const result = await Product.findByPk(id)
    console.log(`Product found with success!`, result)
  } catch (err) {
    console.log('Fail to find the product', err)
  }
}

async function updateProductById(id, productData) {
  try {
    const result = await Product.update(productData, { where: { id:id } })
    console.log(`Product updated with success!`, result)
  } catch (err) {
    console.log('Fail to update the product', err)
  }
}

async function deleteProductById(id) {
  try {
    const result = await Product.destroy({ where: { id:id } })
    console.log(`Product deleted with success!`, result)
  } catch (err) {
    console.log('Fail to delete the product', err)
  }
}

export { sequelize, Product, createProduct, readProducts, readProductById, updateProductById, deleteProductById }