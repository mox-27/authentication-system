import { Router } from "express";

const router = Router();

// Controllers adn middlewares
import { loginUser, registerUser, verifyUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { registerUserSchema, loginUserSchema } from '../zodValidations/auth.shcema.js';

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/verify-user', verifyUser);
router.post('/login', validate(loginUserSchema), loginUser);

export default router;