import { Router } from "express";

const router = Router();

// Controllers adn middlewares
import { registerUser, verifyUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { registerUserSchema } from '../zodValidations/auth.shcema.js';

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/verify-user', verifyUser);

export default router;