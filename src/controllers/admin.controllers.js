import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const getAllUsers = async (req, res) => {
    try {
        const isVerified = req.query.verified !== undefined
            ? req.query.verified === 'true'
            : true;

        const allUsers = await client.user.findMany({
            where: { is_verified: isVerified }, select: {
                id: true,
                name: true,
                email: true,
                profile_img: true,
                role: true,
                is_verified: true,
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

export const deleteAnyUser = async (req, res) => {
    try {
        const { id } = req.params;


        const user = await client.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: `User with id ${id} not found.`,
            });
        }

        if (user.email === process.env.SUPER_ADMIN_EMAIL) {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot delete a SUPERADMIN.',
            });
        }

        await client.user.delete({
            where: { email: user.email },
        });

        return res.status(200).json({
            status: "success",
            message: `User with email ${user.email} deleted successfully.`,
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await client.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: `User with id ${id} not found.`,
            });
        }

        if (user.email === process.env.SUPER_ADMIN_EMAIL) {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot modify role of a SUPERADMIN.',
            });
        }

        await client.user.update({
            where: { id },
            data: {
                role: role.toUpperCase()
            }
        });
        return res.status(200).json({
            status: "success",
            message: `User with email ${user.email} is now ${role}.`,
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error. Please try again later.',
        });
    }
};