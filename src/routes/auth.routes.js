import { Router } from "express";

const router = Router();

// Controllers and middlewares
import { loginUser, registerUser, verifyUser, forgotPassword, resetPassword, logoutController } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { registerUserSchema, loginUserSchema, resetPasswordSchema } from '../zodValidations/auth.schema.js';
import { protect } from "../middlewares/protect.js";

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/verify-user', verifyUser);
router.post('/login', validate(loginUserSchema), loginUser);
router.post('/forgot-password', protect, forgotPassword);
router.post('/reset-password', protect, validate(resetPasswordSchema), resetPassword);
router.post('/logout', protect, logoutController);

export default router;  