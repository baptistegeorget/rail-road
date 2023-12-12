import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/train"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Trains
 *   description: Operations related to trains
 */

/**
 * @swagger
 * definitions:
 *   Train:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       startStation:
 *         type: string
 *       endStation:
 *         type: string
 *       timeOfDeparture:
 *         type: string
 *       newName:
 *         type: string
 */

/**
 * @swagger
 * /train:
 *   post:
 *     summary: Create a new train
 *     tags: [Trains]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Train'
 *     responses:
 *       201:
 *         description: Train created successfully
 *       401:
 *         description: Unauthorized or validation error
 *       404:
 *         description: One or more train stations not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/", authentication, create)

/**
 * @swagger
 * /train:
 *   get:
 *     summary: Get a list of trains
 *     tags: [Trains]
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: No trains found
 */
router.get("/", read)

/**
 * @swagger
 * /train:
 *   patch:
 *     summary: Update train data
 *     tags: [Trains]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Train'
 *     responses:
 *       200:
 *         description: Train updated successfully
 *       401:
 *         description: Unauthorized or validation error
 *       404:
 *         description: Train or train station not found
 *       500:
 *         description: Internal Server Error
 */
router.patch("/", authentication, update)

/**
 * @swagger
 * /train:
 *   delete:
 *     summary: Delete a train
 *     tags: [Trains]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Train deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Train not found
 */
router.delete("/", authentication, remove)

export default router