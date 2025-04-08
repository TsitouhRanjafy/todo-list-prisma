import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import prisma from '../prismaClient.js';
import userRequestValidator from '../helpers/user.validator.js';
import { validationResult } from 'express-validator';
const router = express.Router();
// Register a new user endpoint /auth/register
router.post('/register', userRequestValidator, async (req, res) => {
    const resultValidation = validationResult(req);
    if (!resultValidation.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: resultValidation.array()[0].msg });
        return;
    }
    const { username, password } = req.body;
    const hashpassword = bcrypt.hashSync(password, 8);
    // save the new user and hashed password to the database
    try {
        const isUserExist = await prisma.user.findUnique({ where: { username } });
        if (isUserExist) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: "user aleardy exist" });
            return;
        }
        const user = await prisma.user.create({
            data: {
                username,
                password: hashpassword
            }
        });
        // now that we have a user, I want to add their first todo for them
        const defaultToDo = `Hello :) Add your first todo!`;
        await prisma.todo.create({
            data: {
                task: defaultToDo,
                userId: user.id,
            }
        });
        // create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SCRET ?? 'TEST_KEY', { expiresIn: '24h' });
        res.status(StatusCodes.ACCEPTED).json({ token: token });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
        throw error;
    }
});
router.post('/login', userRequestValidator, async (req, res) => {
    const resultValidation = validationResult(req);
    if (!resultValidation.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: resultValidation.array()[0].msg });
        return;
    }
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });
        // if we cannot find a user associated with that username, return out from the function
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).send({ message: "User not found" });
            return;
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        // if the password does not match, return out of the function
        if (!passwordIsValid) {
            res.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid password" });
            return;
        }
        // then we have a successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SCRET ?? 'TEST_KEY', { expiresIn: '24h' });
        res.status(StatusCodes.OK).json({ token });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
        return;
    }
});
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(StatusCodes.OK).json(users);
    }
    catch (error) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
        throw error;
    }
});
export default router;
