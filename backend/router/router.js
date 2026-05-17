const express = require('express')
const route = express.Router()
const ProductsController = require('../controllers/productsController')
const UsersController = require('../controllers/usersController')
const CartsController = require('../controllers/cartsController')
const OrdersController = require('../controllers/checkoutController')
const AdminController = require('../controllers/adminController')

route.patch('/admin/balance', AdminController.changeUserBalance)

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

route.get('/cart/:userId', CartsController.getUserCart)
route.post('/cart/:productId', CartsController.addToCart)
route.put('/cart/:cartId', CartsController.updateCartQuantity)
route.delete('/cart/:cartId', CartsController.deleteCartItem)

route.post('/checkout', OrdersController.checkout)
route.get('/history', OrdersController.getOrderHistory)

module.exports = route