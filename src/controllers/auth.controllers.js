import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { send_mail } from "../config/nodemailer.config.js";
import jwt from 'jsonwebtoken';
const TOKEN_EXPIRY_MINUTES = 60;
const ACCOUNT_VERIFY_EXPIRY = 60;

const client = new PrismaClient();

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const alreadyExist = await client.user.findFirst({
            where: { email }
        });

        if (alreadyExist) {
            if (!alreadyExist.is_verified) {
                return res.status(400).json({
                    status: "error",
                    message: "Please check your inbox to verify your account"
                });
            }
            return res.status(400).json({
                status: "error",
                message: "User with this email already exist"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        // Dev mode: allow role assignment & immediate verification (for admin)
        if (process.env.NODE_ENV === 'development' && role === 'ADMIN') {
            await client.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    is_verified: true,
                    role: "ADMIN",
                },
            });
            return res.status(201).json({
                status: 'success',
                message: `Successfully registered as ${role}`,
            });
        }


        const verification_token = crypto.randomBytes(32).toString('hex');
        const newUser = await client.user.create({
            data: {
                name, email, password: hashedPassword, verification_token
            },
        });

        await send_mail(newUser.email, "Verify your account", `Click on below link to verify your account ${process.env.CLIENT_BASE_URL}/verify-email/${verification_token}`);

        return res.status(201).json({
            status: 'success',
            message: `Verification link sent to ${email}. Please check your inbox.`,
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};

export const verifyUser = async (req, res) => {
    const { token } = req.body;

    try {
        // Lookup user by verification token
        const user = await client.user.findFirst({
            where: { verification_token: token },
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired verification token.",
            });
        }

        // Calculate expiry time based on created_at + expiry window
        const tokenCreatedAt = new Date(user.created_at);
        const tokenExpiryTime = new Date(tokenCreatedAt.getTime() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

        if (new Date() > tokenExpiryTime) {
            await client.user.delete({
                where: { id: user.id },
            });

            return res.status(400).json({
                status: "error",
                message: "Verification token has expired. Please sign up again.",
            });
        }

        await client.user.update({
            where: { id: user.id },
            data: {
                is_verified: true,
                verification_token: null,
            },
        });

        return res.status(200).json({
            status: "success",
            message: "Account verified successfully. You can now log in.",
        });
    } catch (error) {
        console.error('Error verifying user:', error);

        return res.status(500).json({
            status: "error",
            message: "Something went wrong. Please try again later.",
        });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await client.user.findFirst({
            where: {
                AND: {
                    email, is_verified: true
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(400).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.status(200).json({
            status: "success",
            message: "login successfully",
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.user;

        const user = await client.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(200).json({
                status: "success",
                message: "If that email is registered, a reset link has been sent.",
            });
        }

        const passwordResetToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

        await client.user.update({
            where: { email },
            data: {
                password_reset_token: passwordResetToken,
                password_reset_expiry: expiry
            }
        });

        const resetLink = `${process.env.CLIENT_BASE_URL}/reset-password/${passwordResetToken}`;
        const message = `
            <p>You requested a password reset. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset your password</a>
            <p>This link will expire in ${TOKEN_EXPIRY_MINUTES} minutes.</p>
        `;
        await send_mail(email, "Reset your passoword", "", message);

        return res.status(200).json({
            status: "success",
            message: "If that email is registered, a reset link has been sent.",
        });
    } catch (error) {
        console.error('Forgot passsword error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { password: newPassword, password_reset_token: token } = req.body;

        // Find user by token
        const user = await client.user.findFirst({
            where: { password_reset_token: token },
        });

        const tokenExpired = !user?.password_reset_expiry || user.password_reset_expiry < new Date();

        if (!user || tokenExpired) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired token.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await client.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                password_reset_expiry: null,
                password_reset_token: null,
            }
        });

        delete req.user;
        res.clearCookie("token");

        return res.status(200).json({
            status: "success",
            message: "Password has been successfully reset. Please log in again.",
        });

    } catch (error) {
        console.error('Reset passsword error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }

};

export const logoutController = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV != 'development',
    });

    res.status(200).json({ message: 'Logout successful' });
};