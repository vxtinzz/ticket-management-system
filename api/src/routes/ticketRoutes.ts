import { Router } from "express"
import { addTicket, getTickets, getTicketById, updateTicketById, deleteTicket } from "../controllers/tickets.controller"

const router = Router()

router.post("/", addTicket)
router.get("/", getTickets)
router.get("/:id", getTicketById)
router.patch("/:id", updateTicketById)
router.delete("/:id", deleteTicket)

export default router