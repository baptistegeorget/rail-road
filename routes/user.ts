import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/user"

const router = express.Router()

router.post("/", create) // Validé
router.get("/", authentication, read)
router.patch("/", authentication, update)
router.delete("/", authentication, remove)

export default router;