import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './tic.db'
})

sequelize.authenticate()

const Produto = sequelize.define('produto', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

export { sequelize, Produto }