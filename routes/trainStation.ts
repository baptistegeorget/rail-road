import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/trainStation"
import multer from "multer"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: TrainStations
 *   description: Operations related to train stations
 */

/**
 * @swagger
 * definitions:
 *   TrainStation:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       openHour:
 *         type: string
 *       closeHour:
 *         type: string
 *       newName:
 *         type: string
 *       image:
 *         type: string
 */

/**
 * @swagger
 * /trainstation:
 *   post:
 *     summary: Create a new train station
 *     tags: [TrainStations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/TrainStation'
 *     responses:
 *       201:
 *         description: Train station created successfully
 *       401:
 *         description: Unauthorized or validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", multer({ storage: multer.memoryStorage() }).single("image"), authentication, create)

/**
 * @swagger
 * /trainstation:
 *   get:
 *     summary: Get all train stations
 *     tags: [TrainStations]
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: No train stations found
 */
router.get("/", read)

/**
 * @swagger
 * /trainstation:
 *   patch:
 *     summary: Update train station data
 *     tags: [TrainStations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/TrainStation'
 *     responses:
 *       200:
 *         description: Train station updated successfully
 *       401:
 *         description: Unauthorized or validation error
 *       404:
 *         description: Train station not found
 *       500:
 *         description: Internal Server Error
 */
router.patch("/", multer({ storage: multer.memoryStorage() }).single("image"), authentication, update)

/**
 * @swagger
 * /trainstation:
 *   delete:
 *     summary: Delete train station
 *     tags: [TrainStations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Train station deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Train station not found
 */
router.delete("/", authentication, remove)

export default router