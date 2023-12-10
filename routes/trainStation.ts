import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read } from "../controllers/trainStation"
import multer from "multer"

const router = express.Router()

router.post("/", multer({ storage: multer.memoryStorage() }).single("image"), authentication, create) // Validé
router.get("/", read)

export default router;