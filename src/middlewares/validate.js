import { z } from 'zod';
// Middleware to validate zod schema
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            errors: z.treeifyError(result.error),
            message: "Validation failed",
        });
    }

    req.body = result.data;
    next();
};
