import express from "express"
import { read } from "../controllers/ticket"

const router = express.Router()

router.get("/", read)

export default router