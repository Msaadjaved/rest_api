import express from "express"
import { logMiddleware } from "../middleware/logger.js"
import * as carController from "../controllers/carController.js"

const router = express.Router()

router.get("/", logMiddleware, carController.getAllCars)      // GET /cars
router.get("/:id", carController.getCarById)                  // GET /cars/:id
router.post("/", carController.createCar)                     // POST /cars
router.put("/:id", carController.updateCar)                   // PUT /cars/:id
router.delete("/:id", carController.deleteCar)                // DELETE /cars/:id

export default router
