import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { registerValidator } from "../validators/auth.validators.js";

const router = Router();

router.route("/register").post(registerValidator, validate, registerUser)

export default router