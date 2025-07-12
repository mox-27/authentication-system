import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { send_mail } from "../config/nodemailer.config.js";
import jwt from 'jsonwebtoken';

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
        if (!token) {
            return res.status(400).json({
                status: "error",
                message: "Invalid token"
            });
        }
        const userFromToken = await client.user.findFirst({
            where: { verification_token: token }
        });

        if (!userFromToken) {
            return res.status(400).json({
                status: "error",
                message: "Invalid token"
            });
        }

        await client.user.update({
            where: {
                email: userFromToken.email
            },
            data: {
                is_verified: true,
                verification_token: null
            }
        });
        res.status(200).json({
            status: "success",
            message: "Account successfully verified, you can login now"
        });
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
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
