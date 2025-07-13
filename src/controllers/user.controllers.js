import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const getProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await client.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile_img: true,
                is_verified: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User not found or unauthorized access.",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Profile fetched successfully.",
            user,
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};

export const updateUserController = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, profile_img } = req.body;

        const updatedUser = await client.user.update({
            where: { id },
            data: {
                name, profile_img
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile_img: true,
                is_verified: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!updatedUser) {
            return res.status(401).json({
                status: "error",
                message: "User not found or unauthorized access.",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Profile updated successfully.",
            updatedUser,
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};

export const deleteAccountController = async (req, res) => {
    try {
        const { id } = req.user;

        const deletedAccount = await client.user.delete({
            where: { id },
        });

        if (!deletedAccount) {
            return res.status(400).json({
                status: "error",
                message: "User not found or unauthorized access.",
            });
        }

        delete req.user;
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV != 'development',
        });

        return res.status(200).json({
            status: "success",
            message: "Account deleted successfully.",
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};