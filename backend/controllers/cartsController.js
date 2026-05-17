const { ObjectId } = require("mongodb")
const { getDB } = require("../db/db")

class CartsController {
  static async getUserCart(req, res) {
    try {
      const db = getDB()
      const { userId } = req.params
      const errors = []
  
      if (!ObjectId.isValid(userId)) {
        errors.push("Invalid user ID")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const user = await db.collection("users").findOne({
        _id: new ObjectId(userId)
      })

      if (!user) {
        return res.status(404).json({
            error: "User not found"
        })
      }
  
      const carts = await db.collection("carts").aggregate([
        {
          $match: {
            userId: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind: "$product"
        },
        {
          $project: {
            userId: 0
          }
        }
      ]).toArray()
      res.json(carts)

    } catch (error) {
      console.log(error)
  
      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async addToCart(req, res) {
    try {
      const db = getDB()
      const {userId, quantity} = req.body
      const { productId } = req.params
      const errors = []

      if (!userId) {
        errors.push("User ID is required")
      }

      if (!productId) {
        errors.push("Product ID is required")
      }

      if (!quantity) {
        errors.push("Quantity is required")
      }

      if (typeof quantity !== "number") {
        errors.push("Quantity must be a number")
      }

      if (typeof quantity === "number" && quantity <= 0) {
        errors.push("Quantity must be greater than 0")
      }

      if (!ObjectId.isValid(userId)) {
        errors.push("Invalid user ID")
      }

      if (!ObjectId.isValid(productId)) {
        errors.push("Invalid product ID")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const user = await db.collection("users").findOne({_id: new ObjectId(userId)})
      if (!user) {
        errors.push("User not found")
      }

      const product = await db.collection("products").findOne({_id: new ObjectId(productId)})
      if (!product) {
        errors.push("Product not found")
      }

      if (product && quantity > product.stock) {
        errors.push("Quantity exceeds available stock")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const existingCart = await db.collection("carts").findOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId)
      })

      if (existingCart) {
        const totalQuantity = existingCart.quantity + quantity

        if (totalQuantity > product.stock) {
            return res.status(400).json({
            error: "Quantity exceeds available stock"
            })
        }

        await db.collection("carts").updateOne(
            {
            _id: existingCart._id
            },
            {
            $set: {
                updatedAt: new Date()
            },
            $inc: {
                quantity: quantity
            }
            }
        )

        return res.json({
            message: "Cart quantity updated"
        })
      }

      await db.collection("carts").insertOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      res.status(201).json({
        message: "Product added to cart"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async updateCartQuantity(req, res) {
    try {
      const db = getDB()
      const { cartId } = req.params
      const { quantity } = req.body
      const errors = []

      if (!ObjectId.isValid(cartId)) {
        errors.push("Invalid cart ID")
      }

      if (quantity === undefined) {
        errors.push("Quantity is required")
      }

      if (typeof quantity !== "number") {
        errors.push("Quantity must be a number")
      }

      if (typeof quantity === "number" && quantity <= 0) {
        errors.push("Quantity must be greater than 0")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const cart = await db.collection("carts").findOne({
        _id: new ObjectId(cartId)
      })

      if (!cart) {
        return res.status(404).json({
          error: "Cart item not found"
        })
      }

      const product = await db.collection("products").findOne({
        _id: cart.productId
      })

      if (!product) {
        return res.status(404).json({
          error: "Product not found"
        })
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          error: "Quantity exceeds available stock"
        })
      }

      await db.collection("carts").updateOne(
        {
          _id: new ObjectId(cartId)
        },
        {
          $set: {
            quantity,
            updatedAt: new Date()
          }
        }
      )

      res.json({
        message: "Cart quantity updated"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async deleteCartItem(req, res) {
    try {
      const db = getDB()
      const { cartId } = req.params
      const errors = []

      if (!ObjectId.isValid(cartId)) {
        errors.push("Invalid cart ID")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const result = await db.collection("carts").deleteOne({
        _id: new ObjectId(cartId)
      })

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: "Cart item not found"
        })
      }

      res.json({
        message: "Product removed from cart"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }
}

module.exports = CartsController