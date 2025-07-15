import cron from 'node-cron';
import client from "./lib/prisma.js";
const ACCOUNT_VERIFY_EXPIRY = 60;

const deleteExpiredUnverifiedUsers = async () => {
    const expiryDate = new Date(Date.now() - ACCOUNT_VERIFY_EXPIRY * 60 * 1000);
    try {
        const deleted = await client.user.deleteMany({
            where: {
                is_verified: false,
                created_at: {
                    lt: expiryDate,
                },
            },
        });
        if (process.env.NODE_ENV === 'development') {
            console.log(`[CRON] Deleted ${deleted.count} expired unverified users at ${new Date().toISOString()}`);
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[CRON ERROR] Failed to delete expired users:', error);
        }
    }
};

// Schedule to run daily at 2 AM
export const startCleanupJob = () => {
    cron.schedule('* 02 * * *', () => {
        if (process.env.NODE_ENV === 'development') {
            console.log('[CRON] Running cleanup for unverified users...');
        }
        deleteExpiredUnverifiedUsers();
    });
}

