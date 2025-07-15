import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';


export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Extract token from cookies or headers
        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized. Token missing.',
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check decoded structure
        if (!decoded?.id) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized. Invalid token structure.',
            });
        }

        // 4. Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
                updated_at: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized. User not found.',
            });
        }

        // 5. Attach user to request
        req.user = user;
        next();

    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized. Invalid or expired token.',
        });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden. Admins only.',
        });
    }

    next();
};
