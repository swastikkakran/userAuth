import { Router } from "express";
import { deleteUser } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/delete/:id").delete(deleteUser)

export default router