import { Router } from "express"
import { getResponsibles, getResponsibleById } from "../controllers/tickets.controller"

const router = Router()


router.get("/", getResponsibles)
router.get("/:id", getResponsibleById)

export default router