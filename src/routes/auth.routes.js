import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { registerValidator, loginValidator } from "../validators/auth.validators.js";

const router = Router();

router.route("/register").post(registerValidator, validate, registerUser)
router.route("/login").post(loginValidator, validate, loginUser)

export default router