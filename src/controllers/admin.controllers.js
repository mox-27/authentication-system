import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const getAllUsers = async (req, res) => {
    try {
        const isVerified = req.query.verified !== true;
        const allUsers = await client.user.findMany({
            where: { is_verified: isVerified }, select: {
                name: true,
                email: true,
                profile_img: true,
                role: true,
                created_at: true,
                updated_at: true,
            }
        });
        return res.status(200).json({
            status: "success",
            allUsers
        });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};