import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { send_mail } from "../config/nodemailer.config.js";

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

        await send_mail(newUser.email, "Verify your account", `Click on below link to verify your account ${process.env.BASE_URL}/verify-email/${verification_token}`);

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