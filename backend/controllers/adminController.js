const { ObjectId } = require("mongodb")
const { getDB } = require("../db/db")

class AdminController {
  static async changeUserBalance(req, res) {
    try {
      const db = getDB()
      const {adminId, userId, balance} = req.body
      const errors = []

      if (!adminId) {
        errors.push("Admin ID is required")
      }

      if (!userId) {
        errors.push("User ID is required")
      }

      if (balance === undefined) {
        errors.push("Balance is required")
      }

      if (adminId === userId) {
        errors.push("Admin cannot edit own balance")
      }

      if (!ObjectId.isValid(adminId)) {
        errors.push("Invalid admin ID")
      }

      if (!ObjectId.isValid(userId)) {
        errors.push("Invalid user ID")
      }

      if (typeof balance !== "number") {
        errors.push("Balance must be a number")
      }

      if (typeof balance === "number" && balance < 0) {
        errors.push("Balance cannot be negative")
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const admin = await db.collection("users").findOne({
        _id: new ObjectId(adminId)
      })

      if (!admin) {
        return res.status(404).json({
          error: "Admin not found"
        })
      }

      if (!admin.isAdmin) {
        return res.status(403).json({
          error: "Only admins can change balance"
        })
      }

      const user = await db.collection("users").findOne({
        _id: new ObjectId(userId)
      })

      if (!user) {
        return res.status(404).json({
          error: "User not found"
        })
      }

      await db.collection("users").updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $set: {
            balance
          }
        }
      )

      res.json({
        message: "User balance updated"
      })

    } catch (error) {
      console.log(error)

      res.status(500).json({
        error: "Internal server error"
      })
    }
  }
}

module.exports = AdminController