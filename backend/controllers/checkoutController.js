const { ObjectId } = require("mongodb")
const { getDB } = require("../db/db")

class OrdersController {
  static async checkout(req, res) {
    try {
      const db = getDB()
      const { userId } = req.body
      const errors = []

      if (!userId) {
        errors.push("User ID is required")
      }

      if (!ObjectId.isValid(userId)) {
        errors.push("Invalid user ID")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const userObjectId = new ObjectId(userId)

      const user = await db.collection("users").findOne({
        _id: userObjectId
      })

      if (!user) {
        return res.status(404).json({
          error: "User not found"
        })
      }

      const carts = await db.collection("carts").find({
        userId: userObjectId
      }).toArray()

      if (carts.length === 0) {
        return res.status(400).json({
          error: "Cart is empty"
        })
      }

      let totalPrice = 0

      const orderProducts = []

      for (const cart of carts) {
        const product = await db.collection("products").findOne({
          _id: cart.productId
        })

        if (!product) {
          return res.status(404).json({
            error: "Product not found"
          })
        }

        if (cart.quantity > product.stock) {
          return res.status(400).json({
            error: `${product.name} exceeds available stock`
          })
        }

        const subtotal = product.price * cart.quantity

        totalPrice += subtotal

        orderProducts.push({
          productId: product._id,
          quantity: cart.quantity,
          price: product.price
        })
      }

      if (user.balance < totalPrice) {
        return res.status(400).json({
          error: "Insufficient balance"
        })
      }

      for (const cart of carts) {
        await db.collection("products").updateOne(
          {
            _id: cart.productId
          },
          {
            $inc: {
              stock: -cart.quantity
            }
          }
        )
      }

      await db.collection("users").updateOne(
        {
          _id: userObjectId
        },
        {
          $inc: {
            balance: -totalPrice
          }
        }
      )

      await db.collection("orders").insertOne({
        userId: userObjectId,
        products: orderProducts,
        totalPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await db.collection("carts").deleteMany({
        userId: userObjectId
      })

      res.json({
        message: "Checkout successful",
        totalPrice
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async getOrderHistory(req, res) {
    try {
        const db = getDB()
        const { userId } = req.body
        const errors = []

      if (!userId) {
        errors.push("User ID is required")
      }

      if (!ObjectId.isValid(userId)) {
        errors.push("Invalid user ID")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const userObjectId = new ObjectId(userId)

      const user = await db.collection("users").findOne({_id: userObjectId})

      if (!user) {
        return res.status(404).json({
          error: "User not found"
        })
      }

      const orders = await db.collection("orders").find({userId: userObjectId}).sort({createdAt: -1}).toArray()

      res.json(orders)

    } catch (error) {
        console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }
}

module.exports = OrdersController