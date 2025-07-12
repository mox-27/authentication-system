import { Router } from "express";

const router = Router();

// Controllers adn middlewares
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { registerUserSchema } from '../zodValidations/auth.shcema.js';

router.post('/register', validate(registerUserSchema), registerUser);

export default router;