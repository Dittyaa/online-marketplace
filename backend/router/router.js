const express = require('express')
const route = express.Router()
const ProductsController = require('../controllers/productsController')
const UsersController = require('../controllers/usersController')
const { protect } = require('../middleware/authMiddleware')

route.post('/register', UsersController.register)
route.post('/login', UsersController.login)
route.get('/users', UsersController.getUsers)
route.get('/users/:id', UsersController.getUserById)
route.put('/users/:id/edit', UsersController.editUser)
route.delete('/users/:id/delete', UsersController.deleteUser)

route.get('/products', ProductsController.getProducts)
route.get('/products/:id', ProductsController.getProductById)
route.post('/products/add', ProductsController.addProduct)
route.put('/products/:id/edit', ProductsController.editProduct)
route.delete('/products/:id/delete', ProductsController.deleteProduct)

module.exports = route