const { getDB } = require("../db/db")
const { ObjectId } = require("mongodb")

class ProductsController {
  static async getProducts(req, res) {
    try {
      const db = getDB()
      const products = await db.collection("products").find().toArray()
      res.json(products)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getProductById(req, res) {
    try {
      const db = getDB()
      const { id } = req.params

      const product = await db.collection("products").findOne({
        _id: new ObjectId(id)
      })

      if (!product) {
        return res.status(404).json({
          error: "Product not found"
        })
      }

      res.json(product)

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async addProduct(req, res) {
    try {
      const db = getDB()
      const { name, description, price, stock } = req.body
      const errors = []

      if (!name) {
        errors.push("Name is required")
      }

      if (!description) {
        errors.push("Description is required")
      }

      if (price === undefined) {
        errors.push("Price is required")
      }

      if (stock === undefined) {
        errors.push("Stock is required")
      }

      if (typeof name !== "string") {
        errors.push("Name must be a string")
      }

      if (typeof description !== "string") {
        errors.push("Description must be a string")
      }

      if (typeof price !== "number") {
        errors.push("Price must be a number")
      }

      if (typeof stock !== "number") {
        errors.push("Stock must be a number")
      }

      if (price < 0) {
        errors.push("Price must be a positive number")
      }

      if (stock < 0) {
        errors.push("Stock must be a positive number")
      }

      if (price > 99999999) {
        errors.push("Price must be less than 9 digits")
      }

      if (stock > 999) {
        errors.push("Stock must be less than 4 digits")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      await db.collection("products").insertOne({
        name,
        description,
        price,
        stock,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      res.status(201).json({
        message: "Product added successfully"
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async editProduct(req, res) {
    try {
      const db = getDB()
      const { id } = req.params
      const { name, description, price, stock } = req.body
      const errors = []

      if (!name) {
        errors.push("Name is required")
      }

      if (!description) {
        errors.push("Description is required")
      }

      if (price === undefined) {
        errors.push("Price is required")
      }

      if (stock === undefined) {
        errors.push("Stock is required")
      }

      if (typeof name !== "string") {
        errors.push("Name must be a string")
      }

      if (typeof description !== "string") {
        errors.push("Description must be a string")
      }

      if (typeof price !== "number") {
        errors.push("Price must be a number")
      }

      if (typeof stock !== "number") {
        errors.push("Stock must be a number")
      }

      if (price < 0) {
        errors.push("Price must be a positive number")
      }

      if (stock < 0) {
        errors.push("Stock must be a positive number")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const result = await db.collection("products").updateOne({_id: new ObjectId(id)},{
          $set: {
            name,
            description,
            price,
            stock,
            updatedAt: new Date()
          }
        }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({
          error: "Product not found"
        })
      }

      res.json({
        message: "Product edited successfully"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async deleteProduct(req, res) {
    try {
      const db = getDB()

      const { id } = req.params

      const result = await db.collection("products").deleteOne({_id: new ObjectId(id)})

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: "Product not found"
        })
      }

      res.json({
        message: "Product deleted successfully"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }

  static async deleteProduct(req, res) {
    try {
      const db = getDB()

      const { id } = req.params

      const result = await db.collection("products").deleteOne({
        _id: new ObjectId(id)
      })

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: "Product not found"
        })
      }

      res.json({
        message: "Product deleted successfully"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }
}

module.exports = ProductsController