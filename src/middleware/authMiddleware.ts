import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken'
import { IJwtPayload } from '../model/user.type';
import { env } from '../config/env.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']

    if (!token) { res.status(401).json({ message: "No token provided" }); return;}

    jwt.verify(token, env().jwt_secret_key, (err,decode) => {
        if (err) { res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" }); 
            console.error("\t Erreurs lors de verification token",err);
            return;
        }

        const payload: IJwtPayload = decode as IJwtPayload;
        
        req.body.user_id = payload.id;
    })
    next()
}

export default authMiddleware;