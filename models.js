import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './tic.db'
})

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

sequelize.authenticate()

async function createProduct(product) {
  try {
    const result = await Product.create(product)
    console.log(`The product ${result} was succesfully created!`)
    return result
  } catch (err) {
    console.log('Fail to create product', err)
    throw err
  }
  
}

async function readProducts() {
  try {
    const result = await Product.findAll()
    console.log(`Products found with success!`, result)
    return result
  } catch (err) {
    console.log('Fail to find all products', err)
    throw err
  }
}

async function readProductById(id) {
  try {
    const result = await Product.findByPk(id)
    console.log(`Product found with success!`, result)
    return result
  } catch (err) {
    console.log('Fail to find the product', err)
    throw err
  }
}

async function updateProductById(id, productData) {
  try {
    const result = await Product.findByPk(id)

    if (result?.id) {
      for (const key in productData) {
        if (key in result) {
          result[key] = productData[key]
        }
      }
      result.save()
      console.log(`Product updated with success!`, result)
    }

    return result
  } catch (err) {
    console.log('Fail to update the product', err)
    throw err
  }
}

async function deleteProductById(id) {
  try {
    const result = await Product.destroy({ where: { id:id } })
    console.log(`Product deleted with success!`, result)
  } catch (err) {
    console.log('Fail to delete the product', err)
    throw err
  }
}

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  total_price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const ProductOrder = sequelize.define('productOrder', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

Product.belongsToMany(Order, { through: ProductOrder })
Order.belongsToMany(Product, { through: ProductOrder })

export async function createOrder(newOrder) {
  try {
    const order = await Order.create({
      total_price: newOrder.totalPrice,
      state: 'SENT'
    });

    for (const prod of newOrder.products) {
      const product = await Product.findByPk(prod.id);
      if (product) {
        await order.addProduct(product, { through: { quantity: prod.quantity, price: prod.price } });
      }
    }
    console.log('Order created with success');
    return order;

  } catch (err) {
    console.log('Failed to create order', err);
    throw err;
  }
}

export async function readOrders() {
  try {
    const result = await ProductOrder.findAll()
    console.log('Orders found with success', result)
    return result
  } catch {
    console.log('Failed to read orders', err)
    throw err
  }
}

export async function readOrdersById(id) {
  try {
    const result = await Order.findByPk(id)
    console.log('Order found with success', result)
    return result
  } catch {
    console.log('Failed to read order', err)
    throw err
  }
}

export { sequelize, Product, createProduct, readProducts, readProductById, updateProductById, deleteProductById }