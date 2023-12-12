import express from "express"
import { read } from "../controllers/ticket"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Operations related to tickets
 */

/**
 * @swagger
 * definitions:
 *   TicketRequest:
 *     type: object
 *     properties:
 *       startStation:
 *         type: string
 *       endStation:
 *         type: string
 *       timeOfDeparture:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   TicketResponse:
 *     type: object
 *     properties:
 *       trainName:
 *         type: string
 *       startStation:
 *         type: string
 *       endStation:
 *         type: string
 *       timeOfDeparture:
 *         type: string
 */

/**
 * @swagger
 * /ticket:
 *   get:
 *     summary: Get ticket information for a given journey
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: startStation
 *         required: true
 *         description: The name of the start station
 *         schema:
 *           type: string
 *       - in: query
 *         name: endStation
 *         required: true
 *         description: The name of the end station
 *         schema:
 *           type: string
 *       - in: query
 *         name: timeOfDeparture
 *         required: true
 *         description: The time of departure for the train
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/TicketResponse'
 *       404:
 *         description: Train or train station not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/", read)

export default router