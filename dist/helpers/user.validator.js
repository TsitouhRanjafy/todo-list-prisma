import { checkSchema } from "express-validator";
const userRequestValidator = checkSchema({
    username: {
        errorMessage: 'Invalid email',
        isEmail: true,
        isEmpty: { negated: true },
        escape: true,
        trim: true
    },
    password: {
        errorMessage: 'Invalid password',
        isStrongPassword: true,
        escape: true,
        isLength: {
            options: { min: 8, max: 255 }
        },
        isEmpty: { negated: true }
    }
});
export default userRequestValidator;
