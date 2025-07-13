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