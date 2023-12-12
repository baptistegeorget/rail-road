import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/user"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       pseudo:
 *         type: string
 *       password:
 *         type: string
 *       role:
 *         type: string
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user or authenticate existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successful authentication
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Incorrect password or validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", create)

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user data
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/", authentication, read)

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized or validation error
 *       404:
 *         description: User not found
 */
router.patch("/", authentication, update)

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/", authentication, remove)

export default router;