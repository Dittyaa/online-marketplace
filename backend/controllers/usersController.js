const { getDB } = require("../db/db")
const { ObjectId } = require("mongodb")

class UsersController {
    static async getUsers(req, res) {
        try {
            const db = getDB()
            const users = await db.collection("users").find().toArray()
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal server error" })
        }
    }

    static async getUserById(req, res) {
        try {
            const db = getDB()
            const { id } = req.params
            const errors = []

            if (!ObjectId.isValid(id)) {
                errors.push("Invalid user ID")
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            const user = await db.collection("users").findOne({_id: new ObjectId(id)})

            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                })
            }

            res.json({
            name: user.name,
            email: user.email,
            phone: user.phone
            })

        } catch (error) {
            console.log(error)

            res.status(500).json({
            error: "Internal server error"
            })
        }
    }

    static async register(req, res) {
        try {
            const db = getDB()
            const {name,email,password,phone} = req.body
            const errors = []

            if (!name) {
                errors.push("Name is required")
            }

            if (!email) {
                errors.push("Email is required")
            }

            if (!password) {
                errors.push("Password is required")
            }

            if (!phone) {
                errors.push("Phone is required")
            }

            if (name && typeof name !== "string") {
                errors.push("Name must be a string")
            }

            if (email && typeof email !== "string") {
                errors.push("Email must be a string")
            }

            if (password && typeof password !== "string") {
                errors.push("Password must be a string")
            }

            if (phone && typeof phone !== "string") {
                errors.push("Phone must be a string")
            }

            if (password && password.length < 8) {
                errors.push("Password must be at least 8 characters")
            }

            if (phone && (phone.length < 9 || phone.length > 12)) {
                errors.push("Invalid phone number")
            }

            const existingUser = await db.collection("users").findOne({email})
            if (existingUser) {
                errors.push("Email already registered")
            }

            const existingPhone = await db.collection("users").findOne({phone})
            if (existingPhone) {
            errors.push("Phone number already registered")
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            await db.collection("users").insertOne({
                name,
                email,
                password,
                phone,
                isAdmin: false,
                balance: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            res.status(201).json({
                message: "User registered successfully"
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: "Internal server error"
            })
        }
    }

    static async login(req, res) {
        try {
            const db = getDB()
            const {email, password} = req.body
            const errors = []

            if (!email) {
                errors.push("Email is required")
            }

            if (!password) {
                errors.push("Password is required")
            }

            if (email && typeof email !== "string") {
                errors.push("Email must be a string")
            }

            if (password && typeof password !== "string") {
                errors.push("Password must be a string")
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            const user = await db.collection("users").findOne({email})
            if (!user) {
                return res.status(401).json({
                    error: "Invalid email or password"
                })
            }

            if (user.password !== password) {
                return res.status(401).json({
                    error: "Invalid email or password"
                })
            }

            res.json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isAdmin: user.isAdmin
                }
            })

        } catch (error) {
            console.log(error)

            res.status(500).json({
                error: "Internal server error"
            })
        }
    }

    static async editUser(req, res) {
        try {
            const db = getDB()
            const { id } = req.params
            const {name, email, password, phone} = req.body
            const errors = []

            if (!ObjectId.isValid(id)) {
                errors.push("Invalid user ID")
            }

            if (!name) {
                errors.push("Name is required")
            }

            if (!email) {
                errors.push("Email is required")
            }

            if (!password) {
                errors.push("Password is required")
            }

            if (!phone) {
                errors.push("Phone is required")
            }

            if (name && typeof name !== "string") {
                errors.push("Name must be a string")
            }

            if (email && typeof email !== "string") {
                errors.push("Email must be a string")
            }

            if (password && typeof password !== "string") {
                errors.push("Password must be a string")
            }

            if (phone && typeof phone !== "string") {
                errors.push("Phone must be a string")
            }

            if (password && password.length < 8) {
                errors.push("Password must be at least 8 characters")
            }
            
            if (phone && (phone.length < 9 || phone.length > 12)) {
                errors.push("Invalid phone number")
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            const existingEmail = await db.collection("users").findOne({email, _id: { $ne: new ObjectId(id) } })
            if (existingEmail) {
                errors.push("Email already registered")
            }

            const existingPhone = await db.collection("users").findOne({phone, _id: { $ne: new ObjectId(id) }})
            if (existingPhone) {
                errors.push("Phone number already registered")
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            const result = await db.collection("users").updateOne({
                _id: new ObjectId(id)
            },
            {
                $set: {
                name,
                email,
                password,
                phone,
                updatedAt: new Date()
                }
            })

            if (result.matchedCount === 0) {
                return res.status(404).json({
                    error: "User not found"
                })
            }

            res.json({
                message: "User updated successfully"
            })
        } catch (error) {
            console.log(error)

            res.status(500).json({
                error: "Internal server error"
            })
        }
    }

    static async deleteUser(req, res) {
        try {
            const db = getDB()
            const { id } = req.params
            const errors = []

            if (!ObjectId.isValid(id)) {
                errors.push("Invalid user ID")
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            const result = await db.collection("users").deleteOne({_id: new ObjectId(id)})

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    error: "User not found"
                })
            }

            res.json({
                message: "User deleted successfully"
            })

        } catch (error) {
            console.log(error)

            res.status(500).json({
                error: "Internal server error"
            })
        }
    }
}

module.exports = UsersController