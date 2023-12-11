import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/trainStation"
import multer from "multer"

const router = express.Router()

router.post("/", multer({ storage: multer.memoryStorage() }).single("image"), authentication, create) // Validé
router.get("/", read) // Validé
router.patch("/", multer({ storage: multer.memoryStorage() }).single("image"), authentication, update) // Validé
router.delete("/", authentication, remove)

export default router;