import jwt from 'jsonwebtoken'
import{ Request, Response, NextFunction} from 'express'
const JWT_SECRET = process.env.JWT_SECRET || ""

interface AuthenticatedRequest extends Request {
    userId? : number
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized" })
    }

    const token = authHeaders.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number}
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized" });
    }
}

export default authMiddleware;